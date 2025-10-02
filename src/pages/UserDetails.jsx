import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Button, Typography, Spin, notification } from "antd";

const { Title, Paragraph } = Typography;

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() =>
        notification.error({ message: "Failed to fetch user details" })
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Spin
        tip="Loading..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );

  if (!user) return <p style={{ textAlign: "center" }}>User not found.</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh", 
        padding: 20,
      }}
    >
      <Card style={{ width: 450, textAlign: "left" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          {user.name}
        </Title>
        <Paragraph>
          <b>Email:</b> {user.email}
        </Paragraph>
        <Paragraph>
          <b>Phone:</b> {user.phone || "N/A"}
        </Paragraph>
        <Paragraph>
          <b>Website:</b> {user.website || "N/A"}
        </Paragraph>
        <Paragraph>
          <b>Address:</b>{" "}
          {user.address
            ? `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`
            : "N/A"}
        </Paragraph>
        <Paragraph>
          <b>Company:</b> {user.company?.name || "N/A"}
        </Paragraph>
        <div style={{ textAlign: "center", marginTop: 15 }}>
          <Link to="/">
            <Button type="primary">Back to Users</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
