import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorModal/errorModal';
import Skeleton from '../skeleton/Skeleton'


class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false,
     }
 
 
     marvelService = new MarvelService();

     componentDidMount()
     {
        this.updateChar();
     }

     componentDidUpdate(prevProps)
     {
        if(this.props.charId !== prevProps.charId)
        {
            this.updateChar();
        }
     }
     updateChar = () =>
     {
        const {charId} = this.props;
        if (!charId)
        {
            return;
        }
        
        this.setState({loading: true});
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
     }
     
     onCharLoaded = (char) => {
        this.setState({char, loading: false})
    }

    onError = () =>
    {
        this.setState({
            loading: false,
            error:true
        })
    }


    render()
    {
        const {char, loading, error} = this.state

        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char = {char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage,wiki, comics} = char;
    const notAvaible = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    let imgStyle = {'object-fit': 'cover'}
    if(notAvaible === thumbnail) {
        imgStyle = {'object-fit': 'contain'}
    }
    let additional = comics.length === 0 ? 'По этому персонажу в данный момент нет доступных комиксов' : null;
    return (
        <>
        <div className="char__basics">
                    <img src={thumbnail} alt={name} style ={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {additional}
                    {
                        comics.map((item, i) => {
                            if(i > 9)
                            {
                                return null;
                            }
                            return(
                                <li key = {i} className="char__comics-item">
                                {item.name}
                                </li>
                            )
                        })
                    }
              
                   
                </ul>
        </>
    )
}
export default CharInfo;