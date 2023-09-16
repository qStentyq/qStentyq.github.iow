import './charList.scss';
import ErrorMessage from '../errorModal/errorModal';
import Spinner from '../spinner/spinner';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

class CharList extends Component  {
    state = {
        chars: [],
        loading: true,
        error: false,
        offset: 200,
        newItemLoading: false,
        charEnded: false}

        marvelService = new MarvelService();

        componentDidMount()
        {
            this.marvelService.getAllCharacters()
                .then(this.onRandomHeroList)
                .catch(this.onError)
        }
        onError = () => {
            this.setState({
                error: true,
                loading: false
            })
        }
        onCharListLoading = () => {
            this.setState({
                newItemLoading: true,
            })
        }
        onRandomHeroList = (newChar) =>
        {
            let ended = false;
            if (newChar.length < 8) {
                ended = true;
            }
            this.setState(({chars}) =>
            ({
                
                    chars : [...chars, ...newChar],
                    loading: false,
                    newItemLoading: false,
                    charEnded: ended
                
            }))
        }
        onLoadMore = (offset) =>
        {
    
            this.onCharListLoading()
            this.marvelService.getAllCharacters(offset+9)
                .then(this.onRandomHeroList)
                .catch(this.onError)
            this.setState(({offset}) => ({
                offset: offset + 9
            }))
        }
        renderItems(arr) {
            const items =  arr.map((item) => {
                let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                    imgStyle = {'objectFit' : 'unset'};
                }
                
                return (
                    <li 
                        className="char__item"
                        key={item.id}
                        onClick={() => this.props.onCharSelected(item.id)}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                )
            });
            return (
                <ul className="char__grid">
                    {items}
                </ul>
            )
        }
    
    render ()
    {
        const {chars, loading, error, offset,newItemLoading, charEnded} = this.state;

        const items = this.renderItems(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;


        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
             
                <button className="button button__main button__long"
                disabled = {newItemLoading}
                onClick = {() => this.onLoadMore(offset)}
                style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}
export default CharList;