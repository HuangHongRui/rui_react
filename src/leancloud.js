import AV from 'leancloud-storage'

var APP_ID = '563IXEClQ5Xf1HVFlHaCmorL-gzGzoHsz';
var APP_KEY = '6w8mSAdwqvCvNjXUAgKofymo';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

export default AV;

export function signUp(username, password, successFn, errorFn){
  //新建AVUser实例对象
  var user = new AV.User();
  //设置用户名
  user.setUsername(username);
  //设置密码
  user.setPassword(password);
  //设置处理函数
  user.signUp().then(function(loginedUser){
    let user = getUserFromAVUser(loginedUser);
    successFn.call(null, user);
  }, function(error){
    errorFn.call(null, error);
  });

  return undefined;
}

export function signIn(username, password, successFn, errorFn){
  AV.User.logIn(username, password).then(function (loginedUser){
    let user = getUserFromAVUser(loginedUser);
    successFn.call(null, user);
  },function(error){
    errorFn.call(null, error);
  });

  return undefined;
}

function getUserFromAVUser(AVUser){
  return {
    id: AVUser.id,
    //...是展开运算符，把 AVUser.atrributes 的属性加入当前对象
    ...AVUser.attributes
  }
}

export function getCurrentUser(){
  let user = AV.User.current();
  if(user){
    return getUserFromAVUser(user);
  }
  else{
    return null;
  }
}

export function signOut(){
  AV.User.logOut();

  return undefined;
}

//加载待办事项列表
export function loadList(userID, successFn, errorFn){
  var className = 'todo_' + userID;
  var list = [];
  AV.Query.doCloudQuery(`select * from ${className}`)
  .then(function(res){

    for(let i=0; i<res.results.length; i++){
      let obj = {
        id: res.results[i].id,
        ...res.results[i].attributes
      };
      list.push(obj);

    }

    successFn.call(null, list);

  },function(error){
    console.log(error);
    errorFn.call();
  });
}

//更新事项列表
export function updateListTable(user, itemId, key, value){
  var className = 'todo_'+user.id;
  var item = AV.Object.createWithoutData(className, itemId);
  item.set(key, value);
  item.save();
}

//保存事项列表
export function saveListTable(item, user, successFn, errorFn){
   var TodoList = AV.Object.extend("todo_"+user.id);
   var todoList = new TodoList();
   todoList.set('username', user.username);
   todoList.set('title', item.title);
   todoList.set('status', item.status);
   todoList.set('deleted', item.deleted);
   todoList.save().then(function(todo){
     successFn.call(null,todo.id);
    //  alert('保存成功');
   },function(error){
     errorFn.call(null);
     alert(error);
   })
}