import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './styles.css';
import { SUPPORTED_TOKENS } from 'constants';

const swapSchema = Yup.object().shape({
    from: Yup.string().oneOf(Object.keys(SUPPORTED_TOKENS), "Unsupported token"),
    to: Yup.string().oneOf(Object.keys(SUPPORTED_TOKENS), "Unsupported token"),
    amount: Yup.number().required().min(0, "Expected a positive number")
        .typeError('Must be a number'),
});


const SwapForm = ({ handleSubmit, exchangeContract }) => {

    const [receivingAmt, setReceivingAmt] = useState('-');

    const formik = useFormik({
        initialValues: {
            from: SUPPORTED_TOKENS.ICZ[0],
            to: SUPPORTED_TOKENS.MYTOKEN[0],
            amount: '0',
        },
        
        onSubmit: values => {
            console.log('-----------Swap Form submitted!-----------');
            handleSubmit(values);
        },

        validationSchema: swapSchema,

    });


    const estimateReceivingIcz = async (exchangeContract, amount) => {
        if(!exchangeContract) return;
        try {
            const res = await exchangeContract.getIczAmount(ethers.utils.parseEther(amount));
            console.log(res);
            setReceivingAmt(ethers.utils.formatEther(res));
        } catch(e) {
            console.error(e);
            setReceivingAmt('0');
        }
    };

    const debouncedIczEstimation = useCallback(_.debounce(estimateReceivingIcz, 1000), []);

    const estimateReceivingToken = async (exchangeContract, amount) => {
        if(!exchangeContract) return;
        try {
            // TODO: Not working properly
            const res = await exchangeContract.getTokenAmount(amount);
            console.log(res);
            setReceivingAmt(ethers.utils.formatEther(res));
        } catch(e) {
            console.error(e);
            setReceivingAmt('0');
        }
    };

    const debouncedTokenEstimation = useCallback(_.debounce(estimateReceivingToken, 1000), []);

    useEffect(() => {
        if(formik.values.from == formik.values.to) return;
        
        if(formik.values.from === SUPPORTED_TOKENS.ICZ[0]) {
            debouncedTokenEstimation(exchangeContract, formik.values.amount);
        } else {
            debouncedIczEstimation(exchangeContract,formik.values.amount);
        }

    }, [formik.values]);

    return (
        <div className='card half-width'>
            <h3 className='card-header'>Swap</h3>
            <form className='form' onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='from'>From:</label>
                    <select 
                        onChange={formik.handleChange}
                        value={formik.values.from}
                        name='from'
                    >
                        <option value={SUPPORTED_TOKENS.ICZ[0]}>{SUPPORTED_TOKENS.ICZ[0]}</option>
                        <option value={SUPPORTED_TOKENS.MYTOKEN[0]}>{SUPPORTED_TOKENS.MYTOKEN[0]}</option>
                    </select>
                    {formik.errors.from && <span className='error'>{formik.errors.from}</span>}
                </div>
                <div className='form-group'>
                    <label htmlFor='to'>To:</label>
                    <select 
                        onChange={formik.handleChange}
                        value={formik.values.to}
                        name='to'
                    >
                        <option value={SUPPORTED_TOKENS.ICZ[0]}>{SUPPORTED_TOKENS.ICZ[0]}</option>
                        <option value={SUPPORTED_TOKENS.MYTOKEN[0]}>{SUPPORTED_TOKENS.MYTOKEN[0]}</option>
                    </select>
                    {formik.errors.to && <span className='error'>{formik.errors.to}</span>}
                </div>
                <div className='form-group'>
                    <label htmlFor='to'>Amount:</label>
                    <input 
                        type='text'
                        onChange={formik.handleChange}
                        value={formik.values.amount}
                        name='amount'
                    />
                    {formik.errors.amount && <span className='error'>{formik.errors.amount}</span>}
                </div>
                <div className='form-group'>
                    <small>
                        <b>Estimated Receiving Amount: </b>
                        <span>{receivingAmt}</span>
                    </small>
                </div>
                <div className='form-group'>
                    <button type='submit'>Swap</button>
                </div>
            </form>
        </div>
    );
}

export default SwapForm;