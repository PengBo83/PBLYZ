-- �������ݿ�
create database pblyz default character set utf8mb4 collate utf8mb4_unicode_ci;

-- �������ݿ�
use pblyz;

-- ������Ա��
create table tb_user(
uid int primary key auto_increment comment '�Զ����ID',
uname varchar(15) unique not null comment '�ǳ�',
password varchar(18) not null comment '����',
sex tinyint(1) not null comment '�Ա�0��1Ů',
image varchar(255) not null comment 'ͷ��·��',
tname varchar(32) not null comment '��ʵ����',
phone varchar(32) unique not null comment '�ֻ�����',
ctime datetime not null comment 'ע��ʱ��' default now()
)engine=InnoDB;

-- ��ӹ���Ա
insert into tb_user(uname, password, sex, image, tname, phone) values ('ϵͳ����Ա', '123456', 0, 'gm.png', 'ϵͳ����Ա', '13781566757');

-- ���������
create table tb_topic(
tid int primary key auto_increment comment '�Զ����ID',
uid int not null comment '�����߱��',
title varchar(255) not null comment '����',
recommend tinyint(1) not null comment '�Ӿ�1��0��' default 0,
ctime datetime not null comment '����ʱ��' default now(),
rtime datetime not null comment '���ظ�ʱ��' default now()
)engine=InnoDB;

-- �������ӱ�
create table tb_post(
pid int primary key auto_increment comment '�Զ����ID',
tid int not null comment '����������',
uid int not null comment '�����߱��',
content text not null comment '��������',
ctime datetime not null comment '����ʱ��' default now()
)engine=InnoDB;

--���Ĭ�����������
insert into tb_topic(uid, title, recommend) values (1, '��ӭ�������������վ', true);
insert into tb_post(tid, uid, content) values (1, 1, '���ҳ������ԣ�');

-- �����ظ���
create table tb_reply(
rid int primary key auto_increment comment '�Զ����ID',
pid int not null comment '�������ӱ��',
uid int not null comment '�����߱��',
content text not null comment '�ظ�����',
ctime datetime not null comment '����ʱ��' default now()
)engine=InnoDB;

-- �������ޱ�
create table tb_praise(
aid int primary key auto_increment comment '�Զ����ID',
pid int not null comment '�������ӱ��',
uid int not null comment '�����߱��',
ctime datetime not null comment '����ʱ��' default now(),
unique key uk_praise (pid, uid)
)engine=InnoDB;