import {useState, useEffect} from 'react';
import {get, remove} from '../Calls';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {movieRoute} from '../ApiRoutes';
import { useNavigate } from 'react-router-dom';

export default function MovieList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(movieRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteMovie = async(id, index) => {
        await remove(movieRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
    }

    return(
        <div>

            <div>
                <Button
                    variant='contained'
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => {navigate("AddMovie")}}
                >
                    Add new Movie
                </Button>
            </div>

            <br/>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Movie Id</TableCell>
                            <TableCell align="right">Movie Name</TableCell>
                            <TableCell align="right">Movie Genre</TableCell>
                            <TableCell align="right">Publication Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.MovieId}>
                                <TableCell component="th" scope="row">
                                    {row.MovieId}
                                </TableCell>
                                <TableCell align='center'>{row.MovieId}</TableCell>
                                <TableCell align='center'>{row.MovieName}</TableCell>
                                <TableCell align='center'>{row.MovieGenre}</TableCell>
                                <TableCell align='center'>{row.PublicationDate}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => navigate(`/AddMovie/${row.MovieId}`)}>
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteMovie(row.MovieId, index)}>
                                        <DeleteIcon color="primary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}