import React, { useEffect, useState } from "react";
import {
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const AccessManagementApp = () => {
  const [accesses, setAccesses] = useState([]);
  const [userAccesses, setUserAccesses] = useState({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all accesses on mount
  useEffect(() => {
    axios
      .get("/api/v1/access-management/accesses")
      .then((res) => {
        setAccesses(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch a user’s current accesses when userId is entered (this assumes an endpoint like /api/v1/users/{userId} that returns a user DTO with an "accesses" array)
  const fetchUserAccesses = async (userId) => {
    try {
      const res = await axios.get(`/api/v1/users/${userId}`);
      // Assume the response data has an array field called 'accesses' with objects that have an 'id'
      const userAccessIds = res.data.accesses.map((a) => a.id);
      const accessMap = {};
      accesses.forEach((a) => {
        accessMap[a.id] = userAccessIds.includes(a.id);
      });
      setUserAccesses(accessMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (accessId) => {
    const isEnabled = userAccesses[accessId];
    try {
      if (isEnabled) {
        await axios.post("/api/v1/access-management/remove", null, {
          params: { userId, accessId },
        });
      } else {
        await axios.post("/api/v1/access-management/assign", null, {
          params: { userId, accessId },
        });
      }
      setUserAccesses((prev) => ({ ...prev, [accessId]: !isEnabled }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper className="p-4 m-4">
      <Typography variant="h5" className="mb-2">
        Access Management
      </Typography>
      <TextField
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onBlur={() => {
          if (userId) {
            fetchUserAccesses(userId);
          }
        }}
        fullWidth
        className="mb-4"
      />
      {accesses.map((access) => (
        <FormControlLabel
          key={access.id}
          control={
            <Switch
              checked={!!userAccesses[access.id]}
              onChange={() => handleToggle(access.id)}
              color="primary"
            />
          }
          label={access.name}
        />
      ))}
      {loading && <Typography>Loading...</Typography>}
    </Paper>
  );
};

export default AccessManagementApp;
