import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';
import customer from '../images/customer.png';
import merchant from '../images/merchant.png';
import admin from '../images/admin.png';

const Profile = () => {

    //stuff i use to test
    let tempuser = {
        firstName: 'Michael',
        middleName: 'David',
        lastName: 'Stevens',
        userType: 'customer',
        email: 'test@gmail.com'
    }

    const {logout} = useContext(AuthContext);
    const [user, setUser] = useState(tempuser);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    //fetch orders here
    // useEffect(() => {
    //     //make func to send get req for all transactions
    //     const getUser = async () => {
    //         const { data } = await axios.get('/api/User');
    //       
    //         //if worked, set transactions to post response
    //         if (response.ok){
    //             setUser(data)
    //         }
    //     }
    //     //run func
    //     getUser()
    // }, [])

    let img;
    if (user.userType == "customer"){
        img = customer
    } else if (user.userType == "merchant"){
        img = merchant
    } else if (user.userType == "admin"){
        img = admin
    }

    return(
        <div className="profileBackground">
            <div className='profileInfo'>
                <div className='profileLeft'>
                    <img src={img} width={"100%"} height={"width"}/>
                    <h1 className='profileText' style={{textAlign: "Center"}}>Welcome,</h1>
                    <h1 className='profileText' style={{textAlign: "Center"}}>{user.userType}!</h1>
                </div>
                <div className='profileRight'>
                    <div>
                        <h1 className='profileText'>{user.lastName}, {user.firstName} {user.middleName}</h1>
                        <h2 className='profileText'>Email: {user.email}</h2>
                        <h2 className='profileText'>more info here:</h2>
                    </div>
                    <div>
                        <div className='logoutButton'>
                            <h3 className='profileText' onClick={handleLogout} style={{textAlign: "Center"}}>Logout</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Profile;