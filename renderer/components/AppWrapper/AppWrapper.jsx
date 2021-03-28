import React from 'react'
import PeopleCounter from '../PeopleCounter/PeopleCounter';
import s from './AppWrapper.module.scss'
const AppWrapper = () => {
  return (
    <div className={s.Wrapper}>
      <PeopleCounter/>
    </div>
  )
}

export default AppWrapper
