import React, { Component } from 'react';
import { connect } from 'react-redux';
// COMPONENT IMPORTS
import OneColumnLayout from '../OneColumnLayout/OneColumnLayout';
// MATERIAL-UI IMPORTS
import {
    TextField,
    Button,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    InputAdornment
} from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
// STYLING IMPORTS
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const styles = theme => ({
    paper: {
        width: '100%',
        minWidth: 200,
        height: 230,
        overflow: 'scroll'
    },
    formControl: {
        margin: 'auto'
    },
    largeFormControl: {
        margin: theme.spacing(3, 0),
        padding: theme.spacing(1)
    },
    divider: {
        margin: theme.spacing(3, 0)
    },
    button: {
        display: 'block',
        margin: theme.spacing(3, 0),
        padding: theme.spacing(1),
        color: 'white'
    }
});

class JobPostForm extends Component {
    state = {
        project_title: '',
        position_title: '',
        description: '',
        duration: '',
        budget: '',
        mentor_required: true,
        status_id: 1,
        client_id: 0,
        selected: []
    };

    componentDidMount = () => {
        this.props.dispatch({ type: 'FETCH_ALL_SKILLS' });
    };

    //Saves the text from input on change
    handleInput = (event, property) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        });
    };

    //Submits the full job posting details and associated skill tags to save in the database
    handleSubmit = event => {
        event.preventDefault();
        this.props.dispatch({
            type: 'POST_JOB',
            payload: this.state
        });
        this.setState({
            project_title: '',
            position_title: '',
            description: '',
            duration: '',
            budget: '',
            mentor_required: true,
            status_id: 1,
            client_id: 0,
            selected: []
        });
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Job has been successfully posted!',
            showConfirmButton: false,
            timer: 1500
        });
        this.props.history.push(`/jobs`);
    };

    //adds clicked skill to list of selected tags
    addSkill = skill => {
        // console.log(skill);
        this.setState({
            selected: [...this.state.selected, skill]
        });
    };

    //removes clicked skill from list of selected tags
    removeSkill = skillToRemove => {
        // console.log(skillToRemove);
        this.setState({
            selected: this.state.selected.filter(skill => skill !== skillToRemove)
        });
    };

    render() {
        // console.log(this.state)
        const { classes } = this.props;

        //filters the list of all skills to remove the selected skills
        const renderAvailable = this.props.available
            .filter(skill => !this.state.selected.includes(skill))
            .map(skill => (
                <ListItem
                    key={skill.id}
                    role="listitem"
                    button
                    onClick={() => this.addSkill(skill)}>
                    <ListItemText primary={skill.tag} />
                </ListItem>
            ));

        const renderSelected = this.state.selected.map(skill => (
            <ListItem key={skill.id} role="listitem" button onClick={() => this.removeSkill(skill)}>
                <ListItemText primary={skill.tag} />
            </ListItem>
        ));

        //checks if user type should be able to view this page
        let isClient = () => {
            return this.props.user.user_type === 'Client';
        };

        return (
            <OneColumnLayout header="Post New Job">
                {isClient() ? (
                    <form onSubmit={this.handleSubmit}>
                        <Grid item container spacing={4} justify="space-around" align="center">
                            {/* NEW JOB DETAILS */}
                            <Grid
                                item
                                container
                                xs={8}
                                spacing={4}
                                justify="space-around"
                                align="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.formControl}
                                        label="Project Name"
                                        fullWidth
                                        value={this.state.project_title}
                                        onChange={event => {
                                            this.handleInput(event, 'project_title');
                                        }}
                                        required={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.formControl}
                                        label="Seeking Position"
                                        fullWidth
                                        value={this.state.position_title}
                                        onChange={event => {
                                            this.handleInput(event, 'position_title');
                                        }}
                                        required={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.formControl}
                                        label="Project Duration"
                                        fullWidth
                                        value={this.state.duration}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ScheduleIcon
                                                        fontSize="small"
                                                        color="secondary"
                                                    />
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={event => {
                                            this.handleInput(event, 'duration');
                                        }}
                                        required={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.formControl}
                                        label="Project Budget"
                                        fullWidth
                                        value={this.state.budget}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon
                                                        fontSize="small"
                                                        color="secondary"
                                                    />
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={event => {
                                            this.handleInput(event, 'budget');
                                        }}
                                        required={true}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* PROJECT DESCRIPTION */}
                        <Grid item xs={12} align="center">
                            <TextField
                                className={classes.largeFormControl}
                                label="Project Description"
                                multiline
                                rows="4"
                                variant="outlined"
                                helperText="Please write a short description of any job specifications you might have."
                                value={this.state.description}
                                onChange={event => {
                                    this.handleInput(event, 'description');
                                }}
                                required={true}
                            />
                        </Grid>

                        {/* MENTOR REQUIRED CHECKBOX */}
                        {/* <input
                            type="checkbox"
                            label="Mentor required"
                            title="Mentor Required"
                            placeholder="Mentor Required"
                            value={this.state.mentor_required}
                            onChange={event => {
                                this.handleInput(event, 'mentor_required');
                            }}
                        /> */}

                        <Grid item xs={12} className={classes.divider}>
                            <Divider />
                        </Grid>

                        {/* SKILL SELECTION */}
                        <Grid item container spacing={4} justify="center" align="center">
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    Desired Skills
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography variant="subtitle1" align="center" color="secondary">
                                    Available Skills
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography variant="subtitle1" align="center" color="secondary">
                                    Selected Skills
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Paper className={classes.paper}>
                                    <List>{renderAvailable}</List>
                                </Paper>
                            </Grid>
                            <Grid item xs={5}>
                                <Paper className={classes.paper}>
                                    <List>{renderSelected}</List>
                                </Paper>
                            </Grid>

                            {/* SUBMIT FORM BUTTON */}
                            <Grid item xs={6} align="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className={classes.button}>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                ) : (
                    <Typography variant="h3">You are not authorized to view this page.</Typography>
                )}
            </OneColumnLayout>
        );
    }
}

const mapStateToProps = store => {
    return {
        available: store.allSkillsReducer,
        user: store.user
    };
};

export default withStyles(styles)(connect(mapStateToProps)(JobPostForm));
