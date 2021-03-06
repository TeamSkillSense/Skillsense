import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

//COMPONENT IMPORTS
import TwoColumnLayout from '../TwoColumnLayout/TwoColumnLayout';
import MentorTabs from '../MentorTabs/MentorTabs';
import UserListItem from '../UserListItem/UserListItem';
import PublicProfile from '../PublicProfile/PublicProfile';
import JobListItem from '../JobListItem/JobListItem';
import MessageDialog from '../MessageDialog/MessageDialog';

//MATERIAL-UI IMPORTS
import { Typography, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    jobs: {
        padding: theme.spacing(2, 0, 0)
    },
    placeholder: {
        padding: theme.spacing(2)
    }
});

class MyMentorships extends Component {
    componentDidMount() {
        // gets all accepted mentorship relationships from the server and stores them in the allMentorsReducer
        this.props.dispatch({
            type: 'FETCH_ACTIVE_MENTORS'
        });//sends to mentorSaga

        //clears the details section upon page load until user makes a selection
        this.props.dispatch({
            type: 'CLEAR_SELECTED_USER'
        });//sends to selectedUserReducer
    }

    //sends put request to the database to update the relationship to accepted: true
    acceptMentorship = () => {
        Swal.fire({
            title: 'Are you sure?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#04b8f3',
            cancelButtonColor: '#505d68',
            confirmButtonText: 'Yes, accept this Mentorship!'
        }).then(result => {
            if (result.value) {
                this.props.dispatch({
                    type: 'ACCEPT_MENTORSHIP',
                    payload: { student_id: this.props.selectedUser.id, mentor: this.props.user }
                });//sends to mentorSaga
            }
        });
    };

    //sends delete request to the database to remove the relationship to decline
    declineMentorship = () => {
        Swal.fire({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#04b8f3',
            cancelButtonColor: '#505d68',
            confirmButtonText: 'Yes, decline this Mentorship!'
        }).then(result => {
            if (result.value) {
                this.props.dispatch({
                    type: 'DECLINE_MENTORSHIP',
                    payload: { student_id: this.props.selectedUser.id }
                });//sends to mentorSaga
            }
        });
    };

    render() {
        const { classes } = this.props;
        //checks if user type should be able to view this page
        let isStudent = () => {
            return this.props.user.user_type === 'Student';
        };

        //checks if user type should be able to view this page
        let isMentor = () => {
            return this.props.user.user_type === 'Mentor';
        };

        //maps over the allMentorsReducer and feeds each user to the UserListItem component for rendering
        let mentorList = this.props.mentors.map((mentor, i) => {
            return (
                <div key={mentor.id}>
                    <UserListItem listUser={mentor} />
                    {mentor.inviteMessage && (
                        <Typography variant="subtitle2" align="right">
                            {isStudent() ? 'You sent: ' : 'Student Message: '}
                            {mentor.inviteMessage.message}
                        </Typography>
                    )}
                </div>
            );
        });

        //uses the JobListItem component to render the job list results
        let studentHiredJobList =
            isMentor() && this.props.selectedUser && this.props.selectedUser.job_list
                ? this.props.selectedUser.job_list[0] !== null
                    ? this.props.selectedUser.job_list
                        .filter(job => job.hired === true)
                        .map((job, i) => {
                            return <JobListItem key={i} job={job} />;
                        })
                    : null
                : null;

        let studentPendingJobList =
            isMentor() && this.props.selectedUser && this.props.selectedUser.job_list
                ? this.props.selectedUser.job_list[0] !== null
                    ? this.props.selectedUser.job_list
                        .filter(job => job.hired === false)
                        .map((job, i) => {
                            return <JobListItem key={i} job={job} />;
                        })
                    : null
                : null;

        return (
            <>
                {isStudent() || isMentor() ? (
                    <TwoColumnLayout
                        rightHeader="Details"
                        leftHeader={
                            this.props.user.user_type === 'Student'
                                ? 'Your Mentors'
                                : 'Your Mentorships'
                        }>
                        <>
                            <MentorTabs />
                            {/* Applicable Mentor List by Status */}
                            <div className="list">
                                {this.props.mentors.length !== 0 ? (
                                    mentorList
                                ) : (
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                            color="secondary"
                                            className={classes.placeholder}
                                            gutterBottom>
                                            No items to display.
                                    </Typography>
                                    )}
                            </div>
                        </>
                        <>
                            {this.props.selectedUser.id ? (
                                <>
                                    <PublicProfile />
                                    {isMentor() && this.props.selectedUser.accepted === false ? (
                                        <Grid item container align="center" justify="center">
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">
                                                    Mentor Actions:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className={classes.button}
                                                    onClick={this.declineMentorship}>
                                                    Decline
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    onClick={this.acceptMentorship}>
                                                    Accept
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                            <Grid
                                                container
                                                spacing={4}
                                                justify="center"
                                                alignItems="center">
                                                {this.props.selectedUser && (
                                                    <MessageDialog
                                                        recipient={{
                                                            id: this.props.selectedUser.id,
                                                            username: this.props.selectedUser.username
                                                        }}
                                                    />
                                                )}
                                                {isMentor() && (
                                                    <Grid item xs={12}>
                                                        <Grid item xs={12} className="list">
                                                            <Typography
                                                                variant="h5"
                                                                align="center"
                                                                className={classes.jobs}>
                                                                Active Jobs:
                                                        </Typography>
                                                            <div className="list">
                                                                {studentHiredJobList === '' ||
                                                                    studentHiredJobList === null ? (
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            align="center"
                                                                            className={classes.placeholder}
                                                                            gutterBottom>
                                                                            No items to display.
                                                                </Typography>
                                                                    ) : (
                                                                        studentHiredJobList
                                                                    )}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={12} className="list">
                                                            <Typography
                                                                variant="h5"
                                                                align="center"
                                                                className={classes.jobs}>
                                                                Applied Jobs:
                                                        </Typography>
                                                            <div className="list">
                                                                {studentPendingJobList === '' ||
                                                                    studentPendingJobList === null ? (
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            align="center"
                                                                            className={classes.placeholder}
                                                                            gutterBottom>
                                                                            No items to display.
                                                                </Typography>
                                                                    ) : (
                                                                        studentPendingJobList
                                                                    )}
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}
                                </>
                            ) : (
                                    <Typography variant="h6" color="secondary" align="center">
                                        Select a user to see more information.
                                    </Typography>
                                )}
                        </>
                    </TwoColumnLayout>
                ) : (
                        <Typography>You are not authorized to view this page.</Typography>
                    )}
            </>
        );
    }
}

const mapStateToProps = store => {
    return {
        mentors: store.allMentorsReducer,
        selectedUser: store.selectedUserReducer,
        user: store.user,
        messages: store.allMessagesReducer
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(MyMentorships)));
