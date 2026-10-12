系统主框架
菜单布局
页面容器
导航栏
系统标题
<template>
  <div class="layout">
    <aside>
      <h2>工业 LLMOps</h2>
      <p class="sub">Ollama + deepseek-r1</p>
      <RouterLink to="/">Chat studio</RouterLink>
      <RouterLink to="/prompts">Prompt 编排</RouterLink>
      <RouterLink to="/knowledge">知识库</RouterLink>
      <RouterLink to="/logs">运行日志</RouterLink>
    </aside>
    <main> <RouterView /> </main>
    </div>
  </template>    

<style>
body {
  margin: 0; font-family: Arial, "Microsoft YaHei", sans-serif;background:
   #f5f7fb;}
   .layout {
  display: flex;min-height: 100vh;
   }
   aside {width: 250px;background: #cdb4cd;color: #0a2025;padding: 20px;
}
   aside h2 { margin-bottom: 4px;}
   .sub {color: #0fb0d8;font-size: 12px;margin-bottom: 20px;margin-top: 0;}
    aside a {display: block;color: #0fb0d8;text-decoration: none;margin: 16px 0;}
    /* 当前页导航高亮：必须用 exact-active，否则 "/" 链接在任何页面都会亮 */
    aside a.router-link-exact-active {color: #ffffff;font-weight: bold;}
    main {flex: 1;padding: 24px}
    .card {background: #fff;border-radius: 12px;padding: 18px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);margin-bottom: 16px;}
    </style>