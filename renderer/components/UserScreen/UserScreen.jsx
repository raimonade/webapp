import React, { useState, useEffect, useRef } from 'react';
import s from './UserScreen.module.scss';
import People from './assets/svgs/users.svg';
import Hexagon from './assets/svgs/hexagon.svg';
import Pedestrian from './assets/svgs/walking.svg';
import Hand from './assets/svgs/hand-paper.svg';
import axios from 'axios';

const UserScreen = ({ apiData }) => {
	const [resp, setresp] = useState({});
	const [allowed, setallowed] = useState(false);
	let timeout;

	useEffect(() => {
		getCameraData();
		return () => clearTimeout(timeout);
	}, []);

	function getCameraData() {
		axios
			.get('http://localhost:5000')
			.then(({data}) => onSuccess(data))
			.catch((err) => onError(err));
	}

	function onSuccess(res) {
		setresp(res);
		console.log(res);
		const all = res.MaxPeople - res.PeopleCount > 0;
		setallowed(all);
		console.log(res.MaxPeople);
		console.log(res.PeopleCount);
		timeout = setTimeout(() => getCameraData(), 1000);
	}

	function onError(err) {
		console.error(err);
		clearTimeout(timeout);
	}

	return (
		<div className={s.Screen} allowed={allowed.toString()}>
			<div className={s.PeopleCount}>
				<People />
				<span>
					{resp.PeopleCount > 0 ? resp.PeopleCount : 0} / {resp.MaxPeople}
				</span>
			</div>
			<div className={s.Body}>
				<div className={s.Icon}>
					{allowed ? (
						<Pedestrian />
					) : (
						<>
							<Hexagon />
							<Hand className={s.Hand} />
						</>
					)}
				</div>
				<h1>{allowed ? 'IEEJA ATĻAUTA' : 'IEEJA AIZLIEGTA'}</h1>
			</div>
		</div>
	);
};

export default UserScreen;
