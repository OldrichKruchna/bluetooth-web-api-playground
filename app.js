new Vue({
    el: '#app',
    data: {
        message: ''
    },
    methods: {
        searchDevices: function () {
            this.message = 'Searching...';
            navigator
                .bluetooth
                .requestDevice({filters: anyNamedDevice(), optionalServices: ['device_information']})
                .then(function (device) {
                    console.log(device);
                    return device
                        .gatt
                        .connect();
                })
                .then(function (server) {
                    console.log('Getting Device Information Service...');
                    return server.getPrimaryService('device_information');
                })
                .then(function (service) {
                    console.log('Getting Device Information Characteristics...');
                    return service.getCharacteristics();
                })
                .then(function (characteristics) {
                    console.log('characteristics', characteristics);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
});

function anyNamedDevice() {
    // This is the closest we can get for now to get all devices.
    // https://github.com/WebBluetoothCG/web-bluetooth/issues/234
    return Array
        .from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        .map(c => ({namePrefix: c}))
        .concat({name: ''});
}