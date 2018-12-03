module.exports = {
  server: {
    listen: 80,
    location: [
      {
        lbCounter: 0,
        url: "/",
        proxy_to: [
          "http://localhost:8080",
          "http://localhost:8081",
          "http://localhost:8082"
        ]
      }
    ]
  }
};

//W/"854-nwesE/oOE6DXkVGOdlQbuMUM/IU
//W/"854-nwesE/oOE6DXkVGOdlQbuMUM/IU
//W/"852-SY2k+gg24jgvdP8iH2f62Gn8DPs
