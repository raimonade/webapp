import React, { useState, useEffect, useRef } from 'react';
import s from './UserScreen.module.scss';
import People from './assets/svgs/users.svg';
import Hexagon from './assets/svgs/hexagon.svg';
import Pedestrian from './assets/svgs/walking.svg';
import Hand from './assets/svgs/hand-paper.svg';
import axios from 'axios';

const UserScreen = ({ apiData }) => {
	const [resp, setresp] = useState({});
	const [allowed, _setAllowed] = useState(false);
	let timeout = null;
	const allowedRef = React.useRef(allowed);
	const setAllowed = (data) => {
		allowedRef.current = data;
		_setAllowed(data);
	};

	const allowedSound = useRef(null);
	const notAllowedSound = useRef(null);

	// On Component Mount
	useEffect(() => {
		axios.get('http://localhost:5000/firstboot');
		window.addEventListener('keydown', onKeydown);
		// On component unmount
		timeout = setTimeout(() => getCameraData(), 333);
		return () => {
			window.removeEventListener('keydown', onKeydown);
			clearTimeout(timeout);
		};
	}, []);

	function onKeydown(e) {
		switch (e.key) {
			case 'ArrowLeft':
				setAllowed(false);
				break;
			case 'ArrowRight':
				setAllowed(true);
				break;
			default:
				return;
		}
		setSound();
	}

	function getCameraData(url = 'http://localhost:5000') {
		// tas pats fetch requests, tikai ar moduli
		// kuram labaks error handlings utt,
		// bet ideja nemainas
		axios
			.get(url)
			.then(({ data }) => onSuccess(data))
			.catch((err) => onError(err));
	}

	function setSound(isAllowed = allowedRef.current) {
		notAllowedSound.current.currentTime = 0;
		notAllowedSound.current.pause();
		allowedSound.current.pause();
		allowedSound.current.currentTime = 0;

		if (!isAllowed) {
			notAllowedSound.current.play();
			return;
		}
		allowedSound.current.play();

	}

	function onSuccess(res) {
		
		const all = res.MaxPeople - res.PeopleCount > 0;
		if (allowedRef.current !== all) {
			setSound(all);
			setAllowed(all);
		}
		setresp(res);
		
		timeout = setTimeout(() => getCameraData(), 333);
	}

	function onError(err) {
		clearTimeout(timeout);
	}

	return (
		<div className={s.Screen} allowed={allowed.toString()}>
			<audio ref={allowedSound} src="sounds/ding.mp3"></audio>
			<audio ref={notAllowedSound} src="sounds/VeikalsPilns.wav"></audio>

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
