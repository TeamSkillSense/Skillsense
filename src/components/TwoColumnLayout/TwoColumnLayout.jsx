import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        width: '90%',
        margin: '2% 5%'
    },
    gridHeaders: {
        padding: theme.spacing(1,0),
        margin: theme.spacing(1,0)
    },
    gridItem: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    }
});

//reusable component for two column layout -- use in this fashion:
/* <TwoColumnLayout rightHeader='right header text' leftHeader='left header text'>
	<div>
		<p>Left side stuff</p>
	</div>
	<div>
		<p>Right side stuff</p>
	</div>
</TwoColumnLayout>; */

class TwoColumnLayout extends Component {
    render() {
        const { classes } = this.props;

        return (
            <Grid container className={classes.root} justify="space-around">
                <Grid
                    container
                    justify="space-around"
                    align="top"
                    item
                    className={classes.gridHeaders}>
                    <Grid item xs={6}>
                        <Typography variant="h4" align="left">
                            {this.props.leftHeader}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h4" align="right">
                            {this.props.rightHeader}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-evenly">
                    {this.props.children &&
                        this.props.children.map((child, index) => (
                            <Grid key={index} className={classes.gridItem} item xs={4}>
                                {child}
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TwoColumnLayout);
