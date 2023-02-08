import * as React from "react"
import "./Slider.css"

export const Slider = (props) => {
	const [index, setIndex] = React.useState(0)

	const minIndex = 0
	const maxIndex = props.children.length - 1

	const onPreviousClick = () => {
		// On prend la plus grande valeur entre l'index minimum (0) et l'index
		// demandé (prevIndex - 1). Ainsi, si l'index demandé devient négatif,
		// on reste à l'index 0
		setIndex((prevIndex) => Math.max(minIndex, prevIndex - 1))
	}

	const onNextClick = () => {
		// On prend la plus petite valeur entre l'index maximum
		// (nombre de slides - 1) et l'index demandé (prevIndex + 1). Ainsi, si
		// l'index demandé devient plus grand que l'index maximum, on reste à
		// l'index maximum
		setIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1))
	}

	const goTo = (index) => () => {
		setIndex(index)
	}

	return (
		<div className="slider">
			<ul className="slider__slides" style={{ translate: `${-index * 100}%` }}>
				{React.Children.map(props.children, (slide, slideIndex) => {
					return (
						<li key={slideIndex} className="slider__slide">{slide}</li>
					)
				})}
			</ul>
			<div className="slider__bullets">
				{props.children.map((_slide, slideIndex) => {
					return (
						<button key={slideIndex} className={`slider__bullet ${index === slideIndex ? "slider__bullet--active" : ""}`} type={"button"} onClick={goTo(slideIndex)}>Slide {slideIndex + 1}</button>
					)
				})}
			</div>
			<div className="slider__controls">
				<button className="slider__control slider__control--previous" type="button" aria-label="Previous" onClick={onPreviousClick} disabled={index === minIndex}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15.208 18.29-6-6 6-6" /></svg>
				</button>
				<button className="slider__control slider__control--next" type="button" aria-label="Next" onClick={onNextClick} disabled={index === maxIndex}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6" /></svg>
				</button>
			</div>
		</div>
	)
}
