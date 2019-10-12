import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, TextField, Button, Link, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SkillList from '../SkillList/SkillList';
import UserListItem from '../UserListItem/UserListItem';
import Swal from 'sweetalert2'

const styles = theme => ({
	root: {
		margin: 'auto',
		width: '90vw'
	},
	link: {
		fontWeight: 'bold',
		padding: theme.spacing(0)
	},
	mentorList: {
		overFlow: 'scroll',
		maxWidth: '100vw'
	}
});
class JobApplication extends Component {
	state = {
		cover_letter: '',
		mentor_id: null,
		payment_terms: 'negotiable',
		attachment_url: '',
		file: null
	};
	componentDidMount() {
		this.props.dispatch({
			type: 'FETCH_JOB_DETAIL',
			payload: { id: Number(this.props.match.params.id) }
		});
		this.props.dispatch({
			type: 'FETCH_ACTIVE_MENTORS'
		});
	}

	handleInput = (event, property) => {
		this.setState({
			...this.state,
			[property]: event.target.value
		});
	};

	handleSubmit = event => {
		event.preventDefault();

		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to redact your application!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#04b8f3',
			cancelButtonColor: '#505d68',
			confirmButtonText: 'Yes, submit it!'
		}).then((result) => {
			if (result.value) {
				this.props.dispatch({
					type: 'SUBMIT_APPLICATION',
					payload: {
						...this.state,
						job_id: Number(this.props.match.params.id)
					}
				});}})};

	handleUploadInputChange = e => {
		console.log(e.target.files[0])
		this.setState({ file: e.target.files[0] });
	};

	render() {
		const { classes } = this.props;
		let isAuthorized = () => {
			return this.props.user.access_id === 1;
		};
		return (
			<Grid
				container
				spacing={8}
				justify='space-around'
				alignItems='center'
				className={classes.root}>
				{isAuthorized() ? (
					<Grid item container justify='space-around' spacing={4} xs={12}>
						<Grid item xs={12}>
							<Typography color='secondary' variant='h3' align='center'>
								Job Application
							</Typography>
						</Grid>
						{/* Job Info */}
						<Grid item xs={4}>
							<Typography color='primary' variant='h4'>
								{this.props.job.position_title}
							</Typography>
							<Typography color='primary' variant='h6'>
								{this.props.job.project_title}
							</Typography>
						</Grid>
						{/* Client Info */}
						<Grid item xs={4}>
							<Typography variant='h6'>{this.props.job.username}</Typography>
							<Typography>{this.props.job.location}</Typography>
						</Grid>
						<Grid item xs={4}>
							{this.props.job.skills && (
								<SkillList skillList={this.props.job.skills} />
							)}
							<Typography>
								Budget: $<span>{this.props.job.budget}</span>
							</Typography>
							<Typography>
								Duration: <span>{this.props.job.duration}</span>
							</Typography>
						</Grid>
						{/* <Grid item xs={12}></Grid> */}
						{/* Cover Letter and Resume */}
						<Grid item container spacing={4} xs={12} justify='center'>
							<Grid item xs={12}>
								<Typography variant='h6' align='left'>
									Cover Letter
								</Typography>
								<TextField
									id='standard-name'
									label='Add your cover letter...'
									value={this.state.cover_letter}
									onChange={event => {
										this.handleInput(event, 'cover_letter');
									}}
									margin='normal'
									fullWidth={true}
									multiline={true}
									rows={4}
								/>
							</Grid>
							{/* Insert Resume attachment functionality here */}
							<Grid item xs={12}>
								<TextField
									helperText='Attach Project Proposal'
									type='file'
									onChange={this.handleUploadInputChange}
								/>
								{/* <Button onClick={this.handleAwsUpload}>Upload!</Button> */}
								{/* Mentor Info */}
							</Grid>
						</Grid>
						<Typography variant='h6'>Invite a Mentor</Typography>
						<Grid
							className={classes.mentorList}
							item
							container
							direction='column'
							xs={12}>
							{this.props.mentors.map((user, index) => {
								return (
									<Grid item xs={12}>
										<Typography>Matching Skills: 3</Typography>
										<Typography>{user.username}</Typography>
									</Grid>
									// <div
									// 	key={index}
									// 	value={user.id}
									// 	onChange={event => {
									// 		this.handleInput(event, 'mentor_id');
									// 	}}>
									// 	<Typography>{user.username}</Typography>
									// 	<Typography>{user.focus_skill}</Typography>
									// 	<Typography>
									// 		<span>{user.skills.length}</span> Matching Skill
									// 		{user.skills.length > 1 && 's'}
									// 	</Typography>
									// </div>
								);
							})}
						</Grid>
						<br />
						{/* User Info */}
						<Grid item xs={12}>
							<Typography variant='h6'>Your Account Information</Typography>
							<Typography>{this.props.user.username}</Typography>
							<Typography>{this.props.user.focus_skill}</Typography>
							<Typography>{this.props.user.location}</Typography>
							<Typography className={classes.link}>
								<Link href={this.props.user.github_url}>GitHub Profile</Link>
							</Typography>
							<Typography className={classes.link}>
								<Link href={this.props.user.linkedin_url}>
									LinkedIn Profile
								</Link>
							</Typography>
							{this.props.user.website_url && (
								<Typography className={classes.link}>
									<Link href={this.props.user.website_url}>
										Portfolio/Personal Website
									</Link>
								</Typography>
							)}
						</Grid>
						{/* <Button variant="contained" color="secondary" onClick={this.props.history.push('/search/jobs')}>Cancel</Button> */}
						<Grid item xs={12}>
							<Button
								variant='contained'
								color='primary'
								onClick={this.handleSubmit}>
								Submit
							</Button>
						</Grid>
					</Grid>
				) : (
					<Typography>You are not authorized to view this page.</Typography>
				)}
			</Grid>
		);
	}
}

const mapStateToProps = store => {
	return {
		job: store.selectedJobReducer,
		user: store.user,
		mentors: store.allMentorsReducer
	};
};

export default connect(mapStateToProps)(withStyles(styles)(JobApplication));
