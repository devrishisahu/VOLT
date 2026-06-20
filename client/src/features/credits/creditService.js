const requestCredits = async (amount, token) => {
    return { _id: Date.now().toString(), amount, status: 'pending', user: 'currentUser' }
}

const getAdminRequests = async (token) => {
    return [
        { _id: 'req1', amount: 500, status: 'pending', user: { name: 'Arjun Mehta', email: 'arjun@volt.com' } }
    ]
}

const updateRequestStatus = async (id, status, token) => {
    return { _id: id, amount: 500, status: status, user: { name: 'Arjun Mehta', email: 'arjun@volt.com' } }
}

const creditService = {
    requestCredits,
    getAdminRequests,
    updateRequestStatus
}

export default creditService;
