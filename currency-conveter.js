const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
	const responce =  await axios.get('http://api.currencylayer.com/live?access_key=484d5df28a26ed9ed75c5588d3ad4381');
	const rate = responce.data.quotes;
	const exchangeRate = rate[fromCurrency+toCurrency]

	if(isNaN(exchangeRate)) {
		throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
	}

	return exchangeRate;
}

const getCourteries = async (toCurrency) => {
	try {
	const responce = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`);
	return responce.data.map((country) => (country.name))
	} catch(error) {
		throw new Error('Unable to get countries that use ' + toCurrency)
	}
	
}


const convertCurrency = async (fromCurrency, toCurrency , amount) => {
	const exchangeRate = await getExchangeRate(fromCurrency,toCurrency);
	const countries = await getCourteries(toCurrency);
	const convertedAmount = (amount * exchangeRate).toFixed(2);

	return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can use ${toCurrency} in these countries: ${countries}`;
}	

convertCurrency('USD','INR',300)
	.then(responce => 
		console.log(responce))
	.catch(err => console.log(err.message))