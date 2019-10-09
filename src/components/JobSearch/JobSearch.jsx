import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//MATERIAL-UI IMPORTS
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  FormGroup,
  Select,
  MenuItem,
  IconButton
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  formControl: {
    display: 'block',
    margin: theme.spacing(1),
    minWidth: 150
  },
  select: {
    minWidth: 150,
    margin: theme.spacing(1)
  }
});

class JobSearch extends Component {
  state = {
      searchTerm: '',
      skill: 0
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_ALL_JOBS'
    });
    this.props.dispatch({
      type: 'FETCH_ALL_SKILLS'
    });
  }

  handleSearch = (event) => {
    this.setState({
        ...this.state,
        searchTerm: event.target.value
    });
  };

  handleDropdown = (event) => {
    this.setState({
      ...this.state,
      skill: Number(event.target.value)
    })
  }

  submitSearch = () => {
    this.props.dispatch({
      type: 'FETCH_JOB_SEARCH',
      payload: this.state
    });
  };

  viewDetail = (event, id)=>{
    this.props.history.push(`/jobs/detail/${id}`)
  }

  render() {
    const { classes } = this.props;

    let jobList = this.props.jobs.map((job) => {
      return (
        <div key={job.id} className="list-item" onClick={(event)=>{this.viewDetail(event, job.id)}}>
          {/* left side info */}
          <div>
            <Typography variant="h5">{job.project_title}</Typography>
            <Typography >{job.username}</Typography>
            <Typography >{job.location}</Typography>
          </div>
          {/* right side info */}
          <div>
            <Typography>Budget: {job.budget}</Typography>
            <Typography>Duration: {job.duration}</Typography>
            {job.skill_names[0] !== null && job.skill_names.map((skill, i) => {
              return (
                <Typography key={i} className="skill-tag">
                  {skill}
                </Typography>
              );
            })}
          </div>
        </div>
      );
    });

    let skillList = this.props.skills.map((skill) => {
      return (
        <MenuItem key={skill.id} value={skill.id}>
          {skill.tag}
        </MenuItem>
      );
    });

    return (
      <div className="list-display">
        <Paper className="search">
          <FormControl className={classes.formControl}>
            <FormGroup row="true" className="search">
              <TextField
                className={classes.formControl}
                onChange={this.handleSearch}
                value={this.state.searchTerm}
                label="Search Jobs"
              />

              <Select
                className={classes.select}
                value={this.state.skill}
                onChange={this.handleDropdown}
              >
                <MenuItem value={0}>Select Skill</MenuItem>
                {/* Skill tag list dropdown options */}
                {skillList}
              </Select>

              <IconButton
                className={classes.button}
                aria-label="search"
                color="primary"
                onClick={this.submitSearch}
              >
                <SearchIcon />
              </IconButton>
            </FormGroup>
          </FormControl>
        </Paper>

        {/* Job Search List */}
        <div className="list">{jobList}</div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    jobs: store.allJobsReducer,
    skills: store.allSkillsReducer
  };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(JobSearch)));
