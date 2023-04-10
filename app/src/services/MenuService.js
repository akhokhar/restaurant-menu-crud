const axios = require('axios');

const BASE_URL = 'http://localhost:9000/';

const getMenuDishes = async () => {
    const response = await axios.get(`${BASE_URL}dishes/`);
    return response.data;
}

const deleteMenuDish = async (id) => {
    const response = await axios.delete(`${BASE_URL}dishes/${id}`);
    return response.data;
}
const addEditMenuDish = async (data) => {
    const response = await axios.put(`${BASE_URL}dishes`, data);
    return response.data;
}

export {
    getMenuDishes,
    deleteMenuDish,
    addEditMenuDish
}