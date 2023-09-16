

class MarvelService {
    _apikey = 'apikey=fdd12521ddeaa43bedac19c6a3422b87';
    _apibase = 'https://gateway.marvel.com:443/v1/public';
    _baseOffset = 0;

    getResource = async (url) =>
    {
        let res = await fetch(url);
        if(!res.ok)
        {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);

        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) =>
    {
        const res = await this.getResource(`${this._apibase}/characters?limit=9&offset=${offset}&${this._apikey}`);
        console.log(res)
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) =>
    {
        const res = await this.getResource(`${this._apibase}/characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        let descr = char.description;
        if(descr.length === 0)
        {
            descr = 'О данном персонаже недостаточно информации'
        }
        if(descr.length > 200)
        {
            descr = descr.slice(0,200) + '...'
        }
        return{
            id: char.id,
            name: char.name,
            description: descr,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;