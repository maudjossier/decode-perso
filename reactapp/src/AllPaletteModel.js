import React from "react";
import { Carousel} from 'react-bootstrap';


function AllPaletteModel(props) {
 

  var paletteColor = props.colors;
  var tabPaletteColor = paletteColor.map((color, i) => {
    return (
      <div
        key={i}
        className="paletteAllPalettes"
        style={{ backgroundColor: `${color}` }}
      ></div>
    );
  });
  

  return (
    <div style={{paddingBottom:'1vh', display:'flex', flexDirection:'column',}}>
      <div className="boxAllPalettes">
        <div className='TitleALLPaletteBox' style={{width:'100%'}}> 
          <h3 className="h3Container"> {props.name}</h3>
          <div className="traitContainerAllPalettes"> </div>
            <div className="paletteContainer">{tabPaletteColor}</div>
        
        </div>
      </div>
      <div className='containerCarousel'>
      <Carousel >
        <Carousel.Item className="carouselAllPalettes">
          <div style={{display:'flex', justifyContent:'center', width:'100%'}}> 
              <div className="containerItem">
                  <img
                  className="PhotoInspoAllPalette"
                  key={0}
                    src={props.inspirations[0]}
                    alt="First slide"
                  />
          
          
                  <img
                  className="PhotoInspoAllPalette"
                  key={1}
                    src={props.inspirations[1]}
                    alt="First slide"
                  />
           
                  <img
                  className="PhotoInspoAllPalette"
                  key={2}
                    src={props.inspirations[2]}
                    alt="First slide"
                  />
              </div>
              </div>
            </Carousel.Item>

            <Carousel.Item className="carouselAllPalettes">
          <div style={{display:'flex', justifyContent:'center', width:'100%'}}> 
              <div className="containerItem">
                  <img
                  className="PhotoInspoAllPalette"
                  key={3}
                    src={props.inspirations[3]}
                    alt="Second slide"
                  />
          
          
                  <img
                  className="PhotoInspoAllPalette"
                  key={4}
                    src={props.inspirations[4]}
                    alt="Second slide"
                  />
           
                  <img
                  className="PhotoInspoAllPalette"
                    key={5}
                    src={props.inspirations[5]}
                    alt="Second slide"
                  />
              </div>
              </div>
            </Carousel.Item>
          
      </Carousel>
      </div>
    </div>
  );
}

export default AllPaletteModel;

