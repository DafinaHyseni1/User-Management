import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/usersSlice";
import { Input, Button, notification } from "antd";

export default function UserForm() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      notification.warning({ message: "Name and email are required" });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      company: { name: form.company || "" },
    };

    dispatch(addUser(newUser));
    notification.success({ message: "User added successfully" });

    setForm({ name: "", email: "", company: "" });
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        style={{ width: 180 }}
      />
      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        style={{ width: 220 }}
      />
      <Input
        placeholder="Company"
        value={form.company}
        onChange={(e) => handleChange("company", e.target.value)}
        style={{ width: 200 }}
      />
      <Button type="primary" onClick={handleSubmit}>
        Add User
      </Button>
    </div>
  );
}
