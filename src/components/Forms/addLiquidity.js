import { useFormik } from 'formik';
import * as Yup from 'yup';

import './styles.css';

const addLiquiditySchema = Yup.object().shape({
    token: Yup.number().required().min(0, "Expected a positive number")
        .typeError('Must be a number'),
    ICZ: Yup.number().required().min(0, "Expected a positive number")
        .typeError('Must be a number'),
});


const AddLiquidityForm = ({ handleSubmit }) => {

    const formik = useFormik({
        initialValues: {
            token: 0,
            ICZ: 0,
        },
        
        onSubmit: values => {
            console.log(values);
            console.log('-----------addLiquidity Form submitted!-----------');
            handleSubmit(values);
        },

        validationSchema: addLiquiditySchema,

    });

    return (
        <div className='card half-width'>
            <h3 className='card-header'>Add Liquidity</h3>
            <form className='form' onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='ICZ'>ICZ:</label>
                    <input 
                        type='text'
                        onChange={formik.handleChange}
                        value={formik.values.ICZ}
                        name='ICZ'
                    />
                    {formik.errors.ICZ && <span className='error'>{formik.errors.ICZ}</span>}
                </div>
                <div className='form-group'>
                    <label htmlFor='token'>Token:</label>
                    <input 
                        type='text'
                        onChange={formik.handleChange}
                        value={formik.values.token}
                        name='token'
                    />
                    {formik.errors.token && <span className='error'>{formik.errors.token}</span>}
                </div>
                <div className='form-group'>
                    <button type='submit'>Add Liquidity</button>
                </div>
            </form>
        </div>
    );
}

export default AddLiquidityForm;