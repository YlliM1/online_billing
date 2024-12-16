import React, { useState } from 'react';
import './Register.css';
import {Link, useNavigate} from 'react-router-dom';


    const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
    });

    const navigate = useNavigate();

    const validateForm = () => {
    let formErrors = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    if (!firstName) formErrors.firstName = 'First name is required.';
    if (!lastName) formErrors.lastName = 'Last name is required.';
    if (!email) formErrors.email = 'Email is required.';
    if (!password) formErrors.password = 'Password is required.';
    if (!confirmPassword) formErrors.confirmPassword = 'Confirm password is required.';

    if (firstName && firstName.length < 3) {
        formErrors.firstName = 'First name must be at least 3 characters long.';
        }
        if (lastName && lastName.length < 3) {
        formErrors.lastName = 'Last name must be at least 3 characters long.';
        }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailPattern.test(email)) {
        formErrors.email = 'Please enter a valid email address.';
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordPattern.test(password)) {
        formErrors.password = 'Password must be at least 8 characters, including 1 uppercase letter and 1 number.';
    }

    if (password && confirmPassword && password !== confirmPassword) {
        formErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(formErrors);
    return Object.values(formErrors).every(error => error === '');
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
    };

    fetch('http://localhost/online_billing/server/php/register_users.php', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.success) {
            navigate('/Login');
        } else {
            alert('Error registering user');
        }
        })
        .catch((error) => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again!');
        });
    };

    return (
    <div className="body">
        <div className="container">
        <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        <div className="flex">
            <label>
            <input
                required placeholder="" type="text" className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <span>First Name</span>
            {errors.firstName && <p className="error">{errors.firstName}</p>}
            </label>
            <label>
            <input
                required  placeholder="" type="text"className="input" value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <span>Last Name</span>
            {errors.lastName && <p className="error">{errors.lastName}</p>}
            </label>
        </div>
        <label>
            <input
            required placeholder="" type="email" className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
            {errors.email && <p className="error">{errors.email}</p>}
        </label>
        <label>
            <input
            required placeholder="" type="password" className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            {errors.password && <p className="error">{errors.password}</p>}
        </label>
        <label>
            <input
            required placeholder="" type="password" className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </label>
        <button className="submit">Submit</button>
        <p className="signin">
            Already have an account? <Link to='/Login'> Sign in</Link>
        </p>
        </form>
        </div>
    </div>
    );
};

export default Register;
