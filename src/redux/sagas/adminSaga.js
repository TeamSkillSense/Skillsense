import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

//ADMIN: changes mentor status to approved
function* approveMentor(action) {
	try {
		yield axios.patch(`/api/mentors/admin/${action.payload}`, { newStatus: 3 });
		//Triggers message saga to send system message to user's email
		yield put({
			type: 'SEND_SYSTEM_MESSAGE',
			payload: {
				id: action.payload,
				message:
					`***NOTICE*** Your request to join SkillSense's professional mentorship program has been approved!`
			}
		});
		yield put({ type: 'FETCH_PENDING_MENTORS' });
		yield put({ type: 'CLEAR_SELECTED_USER' });
	} catch (error) {
		console.log('error on approve mentor saga: ', error);
		alert(
			'Oops!  Something appears to have gone wrong.  Refresh the page to try again, or try logging out and relogging back in.'
		);
	}
}

//ADMIN: changes mentor status back to Not Submitted
function* declineMentor(action) {
	try {
		yield axios.patch(`/api/mentors/admin/${action.payload}`, { newStatus: 1 });
		//Triggers message saga to send system message to user's email
		yield put({
			type: 'SEND_SYSTEM_MESSAGE',
			payload: {
				id: action.payload,
				message:
					`***NOTICE*** You have been denied for SkillSense's professional mentorship program.  Please respond to this message for more information or edit your profile and re-submit for admin review.`
			}
		});
		yield put({ type: 'FETCH_PENDING_MENTORS' });
		yield put({ type: 'CLEAR_SELECTED_USER' });
	} catch (error) {
		console.log('error on decline mentor saga: ', error);
		alert(
			'Oops!  Something appears to have gone wrong.  Refresh the page to try again, or try logging out and relogging back in.'
		);
	}
}

//MENTOR: changes mentor status to pending
function* requestAdminReview(action) {
	try {
		yield axios.patch(`/api/mentors/request`);
		yield put({ type: 'FETCH_USER' });
	} catch (error) {
		console.log('error on updating mentor status to pending review: ', error);
		alert(
			'Oops!  Something appears to have gone wrong.  Refresh the page to try again, or try logging out and relogging back in.'
		);
	}
}

function* adminSaga() {
	yield takeEvery('ADMIN_APPROVE_MENTOR', approveMentor);
	yield takeEvery('ADMIN_DECLINE_MENTOR', declineMentor);
	yield takeEvery('REQUEST_ADMIN_REVIEW', requestAdminReview);
}

export default adminSaga;
