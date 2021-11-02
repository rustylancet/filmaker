const fs = require('fs');

//动态加载路由
const useRoutes = function() {
  //读取当前文件所在目录，返回当前文件夹下所有文件
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const router = require(`./${file}`);
    //注册所有路由文件
    this.use(router.routes());
    this.use(router.allowedMethods());
  })
}

module.exports = useRoutes;
