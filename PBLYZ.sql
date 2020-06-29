-- 创建数据库
create database pblyz default character set utf8mb4 collate utf8mb4_unicode_ci;

-- 操作数据库
use pblyz;

-- 创建会员表
create table tb_user(
uid int primary key auto_increment comment '自动编号ID',
uname varchar(15) unique not null comment '昵称',
password varchar(18) not null comment '密码',
sex tinyint(1) not null comment '性别0男1女',
image varchar(255) not null comment '头像路径',
tname varchar(32) not null comment '真实姓名',
phone varchar(32) unique not null comment '手机号码',
ctime datetime not null comment '注册时间' default now()
)engine=InnoDB;

-- 添加管理员
insert into tb_user(uname, password, sex, image, tname, phone) values ('系统管理员', '123456', 0, 'gm.png', '系统管理员', '13781566757');

-- 创建主题表
create table tb_topic(
tid int primary key auto_increment comment '自动编号ID',
uid int not null comment '发表者编号',
title varchar(255) not null comment '标题',
recommend tinyint(1) not null comment '加精1是0非' default 0,
ctime datetime not null comment '创建时间' default now(),
rtime datetime not null comment '最后回复时间' default now()
)engine=InnoDB;

-- 创建贴子表
create table tb_post(
pid int primary key auto_increment comment '自动编号ID',
tid int not null comment '所属主题编号',
uid int not null comment '发表者编号',
content text not null comment '贴子内容',
ctime datetime not null comment '创建时间' default now()
)engine=InnoDB;

--添加默认主题和首贴
insert into tb_topic(uid, title, recommend) values (1, '欢迎大家来到本留言站', true);
insert into tb_post(tid, uid, content) values (1, 1, '请大家畅所欲言！');

-- 创建回复表
create table tb_reply(
rid int primary key auto_increment comment '自动编号ID',
pid int not null comment '所属贴子编号',
uid int not null comment '发表者编号',
content text not null comment '回复内容',
ctime datetime not null comment '创建时间' default now()
)engine=InnoDB;

-- 创建点赞表
create table tb_praise(
aid int primary key auto_increment comment '自动编号ID',
pid int not null comment '所属贴子编号',
uid int not null comment '点赞者编号',
ctime datetime not null comment '创建时间' default now(),
unique key uk_praise (pid, uid)
)engine=InnoDB;