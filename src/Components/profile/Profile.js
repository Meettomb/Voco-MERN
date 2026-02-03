import React from 'react'
import ProfileHero from './ProfileHero';
import '../../Style/profile.css';
import usePageTitle from '../../hooks/usePageTitle';
import AccountSettingTop from './AccountSettings/AccountSettingTop';


export default function Profile() {
  usePageTitle("Profile");
  return (
    <div className='profile_main'>
        <ProfileHero />
        <AccountSettingTop />
    </div>
  )
}
