import {useState, useEffect} from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {Grid, TextField, Button} from '@material-ui/core';
import {post, put, get} from '../Calls';
import {movieRoute} from '../ApiRoutes';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddMovie(){

    const [movie, setMovie] = useState
    ({
        MovieId: "",
        MovieName: "",
        MovieGenre: "",
        PublicationDate: ""
    });

    const navigate = useNavigate();
    const routerParams = useParams();
    const id = routerParams.id;

    useEffect(async () => {
        if (!id)
            return;

        let data = await get(movieRoute, id);
        setMovie(data);    
    }, [])

    const onChangeMovie = e => {
        setMovie({...movie, [e.target.name]: e.target.value});
    }

    const saveMovie = async () => {
        if (!id)
            await post(movieRoute, movie);
        else
            await put(movieRoute, id, movie);
            
        navigate("/");    
    }

    return (
        <div>

            <Grid container spacing={4}>
                <Grid item xs={8} sm={8}>
                    <TextField
                        autoFocus
                        margin="thic"
                        id="MovieId"
                        name="MovieId"
                        label="Movie Id"
                        fullWidth
                        value={movie.MovieId}
                        onChange={e => onChangeMovie(e)}
                        />
                </Grid>

                <Grid item xs={4} sm={4}>
                    <TextField
                        autoFocus
                        margin="thic"
                        id="MovieName"
                        name="MovieName"
                        label="Movie Name"
                        fullWidth
                        value={movie.MovieName}
                        onChange={e => onChangeMovie(e)}
                        />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        autoFocus
                        margin="thic"
                        id="MovieGenre"
                        name="MovieGenre"
                        label="MovieGenre"
                        fullWidth
                        value={movie.MovieGenre}
                        onChange={e => onChangeMovie(e)}
                        />
                </Grid>
                <Grid item xs={8} sm={8}>
                    <TextField
                        autoFocus
                        margin="thic"
                        id="PublicationDate"
                        name="PublicationDate"
                        label="Publication Date"
                        fullWidth
                        value={movie.PublicationDate}
                        onChange={e => onChangeMovie(e)}
                        />
                </Grid>
            </Grid>

            <Button color="secondary" variant='outlined' startIcon={<CancelIcon />}
                onClick={() => {navigate("/")}}
            >
                Cancel
            </Button>  

             <Button color="secondary" variant='outlined' startIcon={<SaveIcon />}
                onClick={saveMovie}
            >
                Save
            </Button>  

        </div>
    )
}