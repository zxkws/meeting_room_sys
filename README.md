
## 学习会议室预订系统记录（nest 通关秘籍 掘金小册）

[![deploy_gh_pages](https://github.com/zxkws/meeting_room_sys/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/zxkws/meeting_room_sys/actions/workflows/main.yml)

## 项目概述
会议室预定系统分为两种用户，普通用户和管理员，普通用户可以根据时间预定会议室，搜索会议室，管理员可以发布会议室
普通用户可以注册，通过邮箱进行注册，邮箱接收验证码来完成注册，注册之后登陆。
管理员不需要注册，账号密码是内置的。

用户模块

普通用户 可以 注册（email）， 修改密码， 找回密码，登陆
管理员 修改密码， 登陆


普通用户可以查看会议室列表，搜索可用会议室列表，提交预定申请，取消预定，查看预定历史，预定成功通知 催办 等

管理员可以查看用户列表，冻结用户，查看会议室列表，搜索会议室列表，添加/修改/删除会议室，审批预定申请，查看会议室统计信息



## 技术栈
- 前端: React + TypeScript
- 后端: Nest.js
- 数据库: Mysql
