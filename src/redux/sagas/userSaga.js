import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
	try {
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		};

		// the config includes credentials which
		// allow the server session to recognize the user
		// If a user is logged in, this will return their information
		// from the server session (req.user)
		const response = yield axios.get('/api/user', config);

		// now that the session has given us a user object
		// with an id and username set the client-side user object to let
		// the client-side code know the user is logged in
		yield put({ type: 'SET_USER', payload: response.data });
	} catch (error) {
		console.log('User get request failed', error);
	}
}
function* fetchSelectedUser(action) {
	try {
		const response = yield axios.get(`/api/user/${action.payload.id}`);
		yield put({ type: 'SET_SELECTED_USER', payload: response.data });
	} catch (error) {
		console.log('Failure on selected user get route: ', error);
	}
}

function* editUserInfo(action) {
	let id = action.payload.id
	try{
		let response = yield axios.put(`/api/user/${id}`, action.payload);
		yield put({
			type: 'FETCH_USER',
			payload: response.data.id
		});
	} catch (error) {
		console.log('Error with posting addStudentInfo', error)
	}}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_SELECTED_USER', fetchSelectedUser)
  yield takeLatest('EDIT_USER_INFO', editUserInfo)
}

export default userSaga;
