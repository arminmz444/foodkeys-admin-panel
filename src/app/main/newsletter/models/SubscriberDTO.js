class SubscriberDTO {
    constructor(data = {}) {
      this.email = data.email || '';
      this.name = data.name || '';
    }
  }
  
  export default SubscriberDTO;