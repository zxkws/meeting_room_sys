
## 前后端项目monorepo仓库模版
```bash
cd packages
nest new backend

cd packages
npx create-react-app frontend

```
为子项目配置
```json
"extends": "../../tsconfig.json",
````
