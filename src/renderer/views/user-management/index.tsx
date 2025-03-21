/**
 * 用户管理页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Space,
  message,
  Popconfirm,
  Modal,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { User } from '../../../main/services/db';

// 定义查询表单字段
interface SearchFormValues {
  name?: string;
  email?: string;
  address?: string;
}

// 定义用户表单字段
interface UserFormValues {
  name: string;
  age: number;
  email: string;
  address: string;
}

const UserManagement: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchForm] = Form.useForm<SearchFormValues>();
  const [userForm] = Form.useForm<UserFormValues>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加用户');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.db.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        message.error(response.error || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索用户
  const searchUsers = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      const response = await window.electronAPI.db.searchUsers(values);
      if (response.success) {
        setUsers(response.data || []);
      } else {
        message.error(response.error || '搜索用户失败');
      }
    } catch (error) {
      console.error('搜索用户失败:', error);
      message.error('搜索用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const resetSearch = () => {
    searchForm.resetFields();
    fetchUsers();
  };

  // 添加用户
  const addUser = async (values: UserFormValues) => {
    try {
      const response = await window.electronAPI.db.addUser(values);
      if (response.success) {
        message.success('添加用户成功');
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error(response.error || '添加用户失败');
      }
    } catch (error) {
      console.error('添加用户失败:', error);
      message.error('添加用户失败');
    }
  };

  // 更新用户
  const updateUser = async (id: number, values: UserFormValues) => {
    try {
      const response = await window.electronAPI.db.updateUser(id, values);
      if (response.success) {
        message.success('更新用户成功');
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error(response.error || '更新用户失败');
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      message.error('更新用户失败');
    }
  };

  // 删除用户
  const deleteUser = async (id: number) => {
    try {
      const response = await window.electronAPI.db.deleteUser(id);
      if (response.success) {
        message.success('删除用户成功');
        fetchUsers();
      } else {
        message.error(response.error || '删除用户失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
    }
  };

  // 打开添加用户模态框
  const showAddModal = () => {
    setModalTitle('添加用户');
    setEditingUserId(null);
    userForm.resetFields();
    setModalVisible(true);
  };

  // 打开编辑用户模态框
  const showEditModal = (user: User) => {
    setModalTitle('编辑用户');
    setEditingUserId(user.id);
    userForm.setFieldsValue({
      name: user.name,
      age: user.age,
      email: user.email,
      address: user.address,
    });
    setModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    userForm.submit();
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理表单提交
  const handleFormSubmit = (values: UserFormValues) => {
    if (editingUserId !== null) {
      updateUser(editingUserId, values);
    } else {
      addUser(values);
    }
  };

  // 表格列定义
  const columns: TableProps<User>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="确定要删除此用户吗？"
            onConfirm={() => deleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 初始化加载
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {/* 查询区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={searchUsers}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
        >
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入姓名" allowClear />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" allowClear />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
              <Button onClick={resetSearch}>重置</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                添加用户
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 用户表单模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{ maxWidth: '500px' }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <InputNumber
              min={1}
              max={120}
              style={{ width: '100%' }}
              placeholder="请输入年龄"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
