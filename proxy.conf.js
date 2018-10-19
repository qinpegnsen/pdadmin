const PROXY_CONFIG = [
  {
    context: [
      "/course",
      "/assistant",
      "/student",
      "/timetable", //课表信息
      "/tutor", //教师信息
      "/goods", //课时商品
      "/order", //订单信息
      "/login",
      "/classroom",
      "/zoom",
      "/statis", //首页统计
      "/notify", //消息通知模板
      "/export", //导出中心
      "/message" //留言
    ],
    target: "http://192.168.10.182:8086",                 //拦截 context配置路径，经过此地址
    // target: "http://192.168.10.109:8086",                 //拦截 context配置路径，经过此地址
    secure: false
  },
  {
    context: [
      "/res", //枚举获取
      "/setting", //系统设置
      "/upload" //文件上传
    ],
    target: "http://192.168.10.182:8084",      //拦截 context配置路径，经过此地址   开发环境
    // target: "http://192.168.10.109:8084",   //拦截 context配置路径，经过此地址   沙箱环境
    secure: false
  },
  // {
  //   context: [
  //     "/goods" //课时商品
  //   ],
  //   target: "http://192.168.10.173:8086",   //拦截 context配置路径，经过此地址
  //   secure: false
  // }
  // {
  //   context: [
  //     "/upload"
  //   ],
  //   target: "http://192.168.10.110:8083",   //拦截 context配置路径，经过此地址
  //   secure: false
  // }
];

module.exports = PROXY_CONFIG;
