import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useGetConfigsQuery } from "./configManagementApi";
import PaginationDTO from "src/core/dtos/PaginationDTO";
import { TablePagination } from "@mui/base";
import ConfigEditorModal from "./ConfigEditorModal";
import FuseUtils from "@fuse/utils";

function WebsiteConfig({
  title,
  desc,
  updatedDate,
  updatedTime,
  activeCount,
  variant,
}) {
  const [configs, setConfigs] = useState([]);
  const [category, setCategory] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchConfigs = async () => {
    const res = await useGetConfigsQuery(category, pageNumber, pageSize);
    setConfigs(res.data.content);
    setTotal(res.data.totalElements);
  };

  useEffect(() => {
    fetchConfigs();
  }, [category, pageNumber, pageSize]);

  const handleEdit = (config) => {
    setSelectedConfig(config);
    setOpenModal(true);
  };

  return (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <h2>Configuration List</h2>
      <TextField
        label="Filter by Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Display Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Placement</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {configs?.map((config) => (
            <TableRow key={config.name}>
              <TableCell>{config.name}</TableCell>
              <TableCell>{config.displayName}</TableCell>
              <TableCell>{config.category}</TableCell>
              <TableCell>{config.placement}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(config)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={pageNumber}
        onPageChange={(e, newPage) => setPageNumber(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPageNumber(0);
        }}
      />
      {openModal && (
        <ConfigEditorModal
          config={selectedConfig}
          onClose={() => {
            setOpenModal(false);
            fetchConfigs();
          }}
        />
      )}
    </Paper>
  );
}

export default WebsiteConfig;
