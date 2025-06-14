import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const BigSavingZone = () => {
    return (
        <div className="p-8">
            {/* Heading */}
            <div className="text-left mb-8 border-l-4 pl-4" style={{ borderColor: '#8A33FD' }}>
                <h3 className="text-3xl md:text-3xl font-bold text-gray-800 mb-2">
                    Big Saving Zone
                </h3>
            </div>

            {/* First Row - 3 Photos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="relative rounded-xl overflow-hidden">
                    <LazyLoadImage
                        src="/saving1.jpg"
                        alt="Saving Deal 1"
                        effect="blur"
                        width="100%"
                        height="256"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                </div>

                <div className="relative rounded-xl overflow-hidden">
                    <LazyLoadImage
                        src="/saving2.jpg"
                        alt="Saving Deal 2"
                        effect="blur"
                        width="100%"
                        height="256"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                </div>

                <div className="relative rounded-xl overflow-hidden">
                    <LazyLoadImage
                        src="/saving3.jpg"
                        alt="Saving Deal 3"
                        effect="blur"
                        width="100%"
                        height="256"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                </div>
            </div>

            {/* Second Row - 2 Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative rounded-xl overflow-hidden">
                    <LazyLoadImage
                        src="/saving4.jpg"
                        alt="Saving Deal 4"
                        effect="blur"
                        width="100%"
                        height="320"
                        className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                </div>

                <div className="relative rounded-xl overflow-hidden">
                    <LazyLoadImage
                        src="/saving5.jpg"
                        alt="Saving Deal 5"
                        effect="blur"
                        width="100%"
                        height="320"
                        className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                </div>
            </div>
        </div>
    )
}

export default BigSavingZone