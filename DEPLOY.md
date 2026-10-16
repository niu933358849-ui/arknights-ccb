# 发布明日方舟之 CCB

## 发布到 Render

1. 将 `D:\web` 中的网站文件推送到 GitHub 仓库。仓库可以设为 Private；`.gitignore` 已排除本机 Chrome 检查目录和环境变量文件。
2. 登录 Render，选择 **New → Blueprint**，连接该 GitHub 仓库。
3. Render 会读取 `render.yaml`，创建 Node Web Service。保留默认设置并开始部署。
4. 部署完成后打开 Render 提供的 `https://…onrender.com` 地址。网站与塞壬唱片转发接口由同一服务提供，曲库接口路径为 `/api/msr/*`。

## 注意

- 当前 Blueprint 使用免费实例。Render 免费 Web Service 闲置 15 分钟后会休眠，下一位访问者可能需要等待约一分钟唤醒。需要持续快速响应时，在 Render 控制台将实例升级为常驻付费实例。
- 每位访问者的猜测、音量和曲库偏好保存在自己的浏览器中；当前版本不会把玩家进度共享给其他人。
- 官方曲库或音源 CDN 发生故障时，相关音乐可能暂时无法加载。网页本身和本地游戏数据仍由该服务提供。
