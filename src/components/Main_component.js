import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, Delete, Edit } from "@mui/icons-material";
import "../styles/style.css";

const MainComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    color: "",
  });

  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://crudcrud.com/api/d2d8455ade0f43c6a54455a5ce05d416/Manan"
      );
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const edited_data = {
      name: formData.name,
      age: formData.age,
      color: formData.color,
    };

    try {
      if (editItemId) {
        // Edit existing data
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edited_data),
        };

        await fetch(
          `https://crudcrud.com/api/d2d8455ade0f43c6a54455a5ce05d416/Manan/${editItemId}`,
          requestOptions
        );

        // Clear the form data
        setFormData({
          name: "",
          age: "",
          color: "",
        });

        // Reset editItemId
        setEditItemId(null);
      } else {
        // Add new data
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edited_data),
        };

        await fetch(
          "https://crudcrud.com/api/d2d8455ade0f43c6a54455a5ce05d416/Manan",
          requestOptions
        );

        // Clear the form data
        setFormData({
          name: "",
          age: "",
          color: "",
        });
      }

      // Fetch and update the table data after editing or adding
      await fetchData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (id) => {
    // Set form data to the selected item for editing
    const editItem = tableData.find((data) => data._id === id);
    setFormData(editItem);
    setEditItemId(id);
  };

  const handleDelete = async (id) => {
    try {
      // Delete data from the API
      await fetch(
        `https://crudcrud.com/api/d2d8455ade0f43c6a54455a5ce05d416/Manan/${id}`,
        {
          method: "DELETE",
        }
      );

      // Fetch and update the table data after deleting
      await fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = tableData.filter((data) =>
    Object.values(data).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="container-1">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              marginBottom: "10px",
              width: "300px",
              backgroundColor: "white",
            }}
          />
          <TextField
            label="Age"
            variant="outlined"
            name="age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            style={{
              marginBottom: "10px",
              width: "300px",
              backgroundColor: "white",
            }}
          />
          <TextField
            label="Color"
            variant="outlined"
            name="color"
            value={formData.color}
            onChange={handleChange}
            style={{
              marginBottom: "10px",
              width: "300px",
              backgroundColor: "white",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ width: "150px" }}
          >
            Submit
          </Button>
        </form>
      </div>

      <div className="table">
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
          value={searchTerm}
          style={{ marginBottom: "10px", width: "300px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((data) => (
                <TableRow key={data._id}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.age}</TableCell>
                  <TableCell>{data.color}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(data._id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(data._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default MainComponent;
