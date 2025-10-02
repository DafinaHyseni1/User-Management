import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUsers, deleteUser, updateUser } from "../redux/usersSlice";
import UserForm from "../components/UserForm";
import { Table, Space, Button, Input, Typography, notification } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

export default function Home() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!users.length) {
      setLoading(true);
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          dispatch(setUsers(res.data));
        })
        .catch(() => {
          notification.error({ message: "Failed to fetch users" });
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, users.length]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    notification.success({ message: "User deleted" });
  };

  const handleUpdate = (id) => {
    const currentUser = users.find((item) => item.id === id);
    if (!currentUser) return;

    const newName = prompt("Enter new name:", currentUser.name);
    const newEmail = prompt("Enter new email:", currentUser.email);
    const newCompany = prompt("Enter new company:", currentUser.company?.name || "");

    if (newName && newEmail) {
      dispatch(
        updateUser({
          ...currentUser,
          name: newName,
          email: newEmail,
          company: { name: newCompany || currentUser.company?.name },
        })
      );
      notification.success({ message: "User updated" });
    }
  };

  const filteredUsers = users.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <Link to={`/users/${record.id}`}>{record.name}</Link>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
      width: 250,
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
      key: "company",
      sorter: (a, b) =>
        (a.company?.name || "").localeCompare(b.company?.name || ""),
      sortDirections: ["ascend", "descend"],
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleUpdate(record.id)}>
            Update
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div style={{ padding: 20, minWidth: 900, textAlign: "center" }}>
      <Title level={2} style={{ color: "black", marginBottom: 30 }}>
        User Management
      </Title>

      <div style={{ marginBottom: 20, display: "inline-block", minWidth: 300 }}>
        <Search
          placeholder="Search by name or email..."
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ margin: "20px auto", minWidth: 500 }}>
        <UserForm />
      </div>

      <div style={{ marginTop: 20, minHeight: 400 }}>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 500 }}
          bordered
        />
      </div>
    </div>
  );
}
