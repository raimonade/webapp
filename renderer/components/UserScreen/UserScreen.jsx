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

	// On Component Mount
	useEffect(() => {
		getCameraData('http://localhost:5000/firstboot');

		// On component unmount
		return () => clearTimeout(timeout);
	}, []);

	function getCameraData(url = 'http://localhost:5000') {
		// tas pats fetch requests, tikai ar moduli
		// kuram labaks error handlings utt,
		// bet ideja nemainas
		axios
			.get(url)
			.then(({ data }) => onSuccess(data))
			.catch((err) => onError(err));
	}

	function onSuccess(res) {
		setresp(res);
		const all = res.MaxPeople - res.PeopleCount > 0;
		setallowed(all);
		timeout = setTimeout(() => getCameraData(), 1000);
	}

	function onError(err) {
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
