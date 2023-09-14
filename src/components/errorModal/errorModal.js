import img from './error.gif'
const ErrorMessage = () =>
{
    return (
        <img style = {{ display: 'block', height: "250px", objectFit: 'contain', margin: "0 auto"}}   src={img} alt="error404" />
    )
}

export default ErrorMessage 