"use client";
import Image from "next/image";
import React, { useState } from "react";

function Header() {
    const options = [
        { name: "Personal Information" },
        { name: "Attendance log" },
        { name: "Absent request" },
        { name: "Salary" },
        { name: "Log out" },
    ];
    const [visible, setVisible] = useState(false);
    return (
        <div className="md:w- w-full bg-blue-700 flex justify-between h-14 items-center px-4 fixed right-0">
            <div className="flex justify-center items-center">
                <h3 className="text-white text-sm font-extrabold mx-8 uppercase">
                    <a href="/dashboard">Human resource management</a>
                </h3>
            </div>
            <div className="flex items-center">
                <Image
                    className="relative dark:drop-shadow-[1_1_1.3rem_#ffffff70] dark:invert mr-8 "
                    src="/assets/icons/notice.svg"
                    alt="NoticeLogo"
                    width={24}
                    height={24}
                    priority
                />
                <span className=" font-medium text-sm text-white line-clamp-1">
                    Nguyễn Văn A
                </span>
                <img
                    src={url}
                    alt="User's avatar"
                    className="w-8 h-8 object-cover rounded-full mx-3"
                />
                <button
                    onClick={() => setVisible(!visible)}
                    onBlur={() => setVisible(false)}
                >
                    <Image
                        className="relative dark:drop-shadow-[1_1_1.3rem_#ffffff70] dark:invert transform transition-all ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md rounded-full"
                        src="/assets/icons/dropdown.svg"
                        alt="dropdown"
                        width={16}
                        height={16}
                        priority
                    />
                </button>
                <div
                    className={`absolute w-60 py-2 bg-white self-start right-2 top-12 border rounded-sm border-slate-300 flex flex-col transition-all duration-300 origin-top ${
                        visible
                            ? "opacity-100"
                            : " opacity-0 invisible scale-y-0"
                    }`}
                >
                    {options.map((option) => (
                        <button
                            className={` h-[60px] hover:bg-[#56CCF26B] w-full text-start px-4 text-sm font-normal`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
const url =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgVFhUYGRgaGhgYGhwaGhgYGBgYGBgZGRgaGhgcIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHjQhJSs0NDQ0NDY0NDQ0MTQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NjQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA9EAACAQIEAwYEBAUDAwUAAAABAgADEQQSITEFQVEGImFxgZETMqHBQrHR8BQjUoLhFWKiM3KSBxYkwtL/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAKhEAAgICAgICAgEDBQAAAAAAAAECEQMhEjEEUUFhMnGRFCIzE4Gx4fD/2gAMAwEAAhEDEQA/APQorx7RWnfZ5w14rx7R7RaAjeKStFaICMksREbNAEPmj5owEbLAex80WePkMiyGGh7Hzxw8hlMYCFBbDq0JeV1BhVQxNFpk7xAxCnCKkhspIhHvJESJEVjoV40ZlkLGOgsLEJEGSWJjHtHiivEMUcRrxAwAkJKQvFmgBK8V5C8a8AJkxryN414ASikbxQAq2itJlYJ3tNkctEgYs0EphaaQY0gtNLw3wxI0xaFDTNtmiigD05XImkFvINREFIHEpoktU0EgyWkQ5Ebdgo0WhTEXwhI0qt94cGZttGiSANREgKIllnA3IHnIZgdRGpMOKBhIHEYpE+YxYuuVUn2/XynnPHeLO75EJJJtvvc9ZcY8tsynPjpdnT47tQActNQT43b8pWp8fxG7lLdAq/nOZRcgtux3PM/oJFa5vrG3HpIuEZdyZ2VLtNf5kB8u7+s1cFxKnU0Bs39LaE+R2M85LkQ9PFkHfod9QR0mbaNOJ6U0gTMngXFPiplc3dRv/Wv9XnyPmOs0yY0S9MleOGgyZHNHRNhs0WaBzRs8KHyD5os8BmizQoOQfPFmgM0fNCg5Bg8fNBARyIqHZItGzwZBiCmOhWTzxRZIotD2FYa2lSsms0mWVqtLWVGRDiUlWGQ2kikaosqxVRbpm4j5pSpuRCipIcR2XFIEQe8rlrwYqRcSrLTAQbII6NeImMRUa8qcV4o9FMwFz0l6pW6ETj+NcVyuUNj9oXYVWzL4p2mrP3MjC/ObHYGrXqGq7sfhpZFB/E7an0UW/wDIdJRw+PTIbgFj+I8po4dzSw1JQfnzubaZizm3n3cgjq1Qrp32G4/xa4IU8rD7TlOG0szNUPLuj13+lpqYtMwJmG2HcnKhPvYCXJpRpaMopudtWW8Q8rZheQKFe7ct4nUwbmwmFndxfyWTU95EtAI0IrwsKNbgmLKVUN9LgHyY2P539J3LVZ5vR3B8R+c9DeVAxy/BIvEHgbx800Mg/wASNmgs0RgATPFng7GSRCYBsfMYeiJXK2habwYRe9lxRFlg1eEDTI2HCyVpG8WaAE7RSOaKABY5kRJWgIQURmQRMZAtACD0RylZhYy0WkSRLRLGDaQNjDZ5E1IANTe2hguKVDk0O8k7AiZ1Vs7AZtOcllI4vtHxGujZKeYjmRy9pxtbF1g/eDFj1veezVMRRQkFBt0nGY6ilVy6AFwdBEkxM4uriaqmzEi/KewPgs+DoADvLSpkefw1uPWcvi+zFSpZ2UX0NuX0lnCdqK1G1LE0XFrKrqt1sNr22hK0rKx020yvWdjZALsdLDrLDYcIltzzPU/pLVV6dNHrKC2bvacgenSchxDtBWZ8tKiz32NiRM5T5aRtigse32XsQNzKUzKz44nM6ZR0P+JawlZmUFlsecSVGvJS+CyQRGB1kgdJUeob2EaZMo7NzhqZnReroP8Alr9LzvmM4DgGOpJWQ1GsBflexIIF/e89GVBuJpCSfRz5YyTVoqsIyqTLBWFpoBNLMVEDToGWkoiTzQbVbSbbLpIMKYiCCDR2OwjM5va0CrRKrTBgMgEMyseUItG2+8V0S1ZXUyx8I2hsPhbHMZaZlkuXoqMfZmXjwNX5tIR6+ljGA+aKVvjRR0BqKkkKcMqyUiworskEyyw5laoZSBoG0GYPE4pEF3YATPHGkNsouDKsmjQYGRq91SSfLxMznxzswA2vsNzOlw1IKoL2vvrykuVFKJn4LC1GUMRa/I9JV4zV+Auigsek2cTxRFBsbkTi6/GUaqc5BW/PlFG5PYSqK0AwSVa7lstl8Zpf+3gGDqbHnNbC1aZW6EWPSZvaHjAoUzb5joJsvoyf2BxOKeihOcEDrOY4z2OWvkxCMEL5ajEAlyXCFgG3HyixvpczFxXEKtTusxtPSOCOGw1Hnami+qjL+YmebUTXB/dJpmVj8OEw4Vrljpf0nM1OBCqgVmsFz6HYllyof7SSdQb6bTqO1tbVUA/fOYfBsXdyjaHoeYmDSWztStUYGH7MVaIF6pBuWJRiVIOy5Dpb3luqgUePtOmx9VVUi2s5TGVrm0XKyowpDZ5n4uoVuR+76CFZ5XNPOb7jYDlcczF8FVbB0/k2Ia63v4z17g7sMPSDbimt/bT6WnnnZ/AK9VfisAinMQT85HyjynpRcb30M0wwq2zn8zKmlFfAQvGFQyIMGaoBGk6NHCrLlMM2006GBFtZUo41LaQ/+oKBvM5N/BpFJdl0IFGgkFpi95jYjizXsBHqY1it9ouLKtGw1VQ2pEgKiakmc6KjEi5iqMb7x8RcjXr8T5KJWSsSbykjw1FoUkF2SxD6wVap3RHxTQJe4tKRLA38Yoso6RSiTr1aMzzDw/ESNDrLSY0GZ8GWpJl68zuKYgIjEHW0bE48IpP0mG1X4rF3bKlveHQ1swabviH/AJrZUXW3WaLPTQXLAKNus53iL/ziaRJXbwifDNa73JO3hGkJv0dHhuMlmC0kFiQMxnXtw8sFbMS1tb7TkuyuBb4igju7z0PYSZOuils5PjJZFsxVQfS8w8DwNKgLsLX2m9xXh2dwzvcA6CXAoUAAaCax1sylvRiUeD5BZWI6azK4vWyf9Sz/AJzp8bigik8+QnAcZU/O51J0HQS47IloDVpUH1Rsp6GdV2Vrg0SgPyMR6P3gffNOHDqV03lzhGNajUFZSTSKinVQa5D+Gpl56i58Mw5THyGlG37/AIN/Ei5Tpd1/J0faLhuexFZ1IHqV2+be+u8xMNhwlUOWuQLD8rnqZb4vhi1z8dyCcwYBSNRcWsNdDMKjnVgWdiP9yi5HmBOR0elxaV2a/FqvOczWqazS4ni1K6Gc3icUBziTopvRfRxbeVmqEjuG1ybAcxe23ofeZyVnfbRRueU0KFNiAFFrC1+Z5+kTyqD9iWFzTVtFsVSygEhW9b/TUTZ4fxytRWznMu173t0vMWjQYcpdrqrUSp0N1+hv9pcPKlKaVKmZ5PChjxOVu0d3wbihqrci00mN55Zw7i1WjoDcXne8K4l8VL8+c7WjzEzS2ickjeDqPa0bPEATYS1SqXWxlJTeWEiZSGLWMjV1N42IexjI+kYiSmWaJlBXPOWUeJoaJ1TeUqmKCm0sh73lSpRvrGhMJ/EiKAyCKMRKjUtvLbVwouTMzH4paalrbSvhgzocQdFtop0+kJSoIxss47GIq53bfZeswcVUeueap06x8FROJfM4sqnTxnU/wtNVykd6ZmnZg4DBN8qr6mb3D+EZ7l2FhtFQwhI7txymhhOEOBuReFhQfBlKLXvyljiHGUCd3UnpCUOEoPm1Mz+0xSjRLAAHlFpsDCr412BYDQSg3aN1FspJ2lrhTNVQXFh+c0/9OTLbKJukkZNtmCceWFydTr5TM4hSd1znW2wnSNwtbkDSZuNw70+9uBKslo4ms5GlrSxw56ikOBodDm0DLzHj6TSxdFDZ3Xvf08v7v0lclmIAF2a9uQCgXJPQAAn0nD5HkR3GO/fo9LxfCk6nJ169mxwziaUlamx7hBdGOyC4DofC7AjzPSB4ljEqrmpWcDQlBmAPQ22M57EAkUm3GYkt+Eo4KOARpcDl4R+x2IamtZG0ZmuAeenLznHCT473R25YJS18mbxLEPe2UjoLa+0qVcMoNjdz4/LfyH3M38ZidC5sN7eJ/QTBauo1Opk/6jl1ouOOMdy2WaFHYn0HIenKaCVbbWmH/qDHRRCpiWA+UnzNocWVzj8G7RxHeg8dUuAo8/sPvMhKz3vcDy/zvLaYkXuST6aWHjcTXx0oz5SZz+W5TxuMV2Ia6GaPBuJvQcXvlMxq+Pp3/F6WlynildMhuDyzKVPvt9Z6SywerPKeDJFXR6dhq4dQwNwY9QzkezXEijfDbadibERmZGi8so8qqLQitBgh6zC8SGQqiOu0AJx0aDJiDRAWlgnUkGRSoYVdjEUUPWKO1MxSyKOexJfEYjIhORfm6Q+IwNfEOKNPNkX5raCdPwrs+1Niii1zdj4HlOwweEWmuVQB95hKXybqPwcnT4R/DYe4F2025RU1d7WX1nR4oXJU7GAWw2FpUVeyWx8JSVFF9W5y0cQN7SmzwL4pRuQPWPgLkXHxRlLG0kqjLUUMIP8Ai0OzD3EmKg5RqNE8rHo4NFUKosBGegBJF5Bnj2GjKJOZpl9oMcEUIPnYX8hOlqIpBLbDUnoBPNsVX+JUd+ROnkNvpMPJy8Y0u2dfhYFOfJ9L/kr1jfc6fu8Fi8CWqD4b6hFJOoQZhYrnGuax2t1hkVXzobg5WOboFF9OpFtuczzgXamamdWQFmBzE2UfhC62IIsR1E8xv7o9l+is9R8opIEyI17qLXOvU3OpJ2gK4c7FR43/AEkjTsPm3jCggFyxN+lhLVIVFKupNsz3toANhBLSX+m/nrLrlBsvvrA1KhMpMzlEEBbnbyiNXkJHLeSVANZRFEkQnUwdduV7L9TJNUvIilzaCYNX0JSEAyjvH1a3nE4t3nIHl830I/OGopfW33JPjE2GF8zG58dfYbR2HAnh+IE2yo+n4hc/bX3ndcE48gp/znCW2LaX8gdTPP6uKA2+usrDO55zaOeSVHNk8aEpX8/R6ZiO1+GGiszeSG3/ACtJYbtXhnNizKf9ym3uLzz+nhQurbSNfGog2v4QWeQ/6PGlttf7nrQrK6hkYMDzBBHuIZDPH8B2irU2zUlsOY1KnzGxnbdne2CV2FOovw6h217r+Ck7HwnRHKpaemceTx3HcXaOoqnlGG0kZAzY5gtOPUewuTYDeRpzO47iMq5R6zKcuKNcMOUt9FSrxtrmwFuUU4+timLEqBa+mvTSKYcpezv44vSPoPBUyAWbdjfyHKPicRl0G8MzWmVXe5JmkY8nbOGUqVAnc3lTGY9EUlmtBcV4ilFC7GeSdoe0D1GJzWXkJulq2YSlukdRxrt6qXWnqevKcLxXtPXq7sR5aTEcljeEFKS5v40NQXzsPR4hXG1RvczTw/aTFptVb11meiAaSWkE37BpejrMD/6hV0AFRA9ufOdbwjtnhq1gWyMeRnkdRdJbwPC3cBwQovoTe+nMARSmoq2VDFKbqKtno/arjbNehTNl2Yjduov0nNV6hQZR0ufOKmdALk5QBc7mwteV+IVbC/P92nl5JOcrPoMOJY4JVXv9mdiHIcMTryX/APXh4Swz1Hpqpdra90d1bXIAyrYW02mfQUsSx9JpA2VR+9zJkkUleysaWkg9OW3MgwisuikachUp2mjl00gTRG5OspMmUSkFtBuJcdBBMqjxlIzcQNKnD5BfX2EG9Q8oRNBmMGEUkEd7CZ9avfQSOIxBOghcLhr7xpV2TKXJ0gdHDFtTtLFXFJSGgzN0HLz6SONxQXuJq30H+ZZ4fgsqXb5muSTv4QuuxJW6j/JkVeIM4Jtbr0l3AYHvLTy56rbLpZefPQeJiqKgLEKNDbXU3AvcjbpH4ZinTEU6mwDa9SDvKb06JUWnb2zscH2Oa2atVt/spgaf3t+kDi+ztA7PUuDcfK1iOYawIPkZo4jtMgW4Qm1yc3dF/SNwvivxxmK5SSQMo1Ivpa+2nOcbyTS5PR0f6fs18LjlARHez2AObQsepAuBeaTYZ+k54YZS2REzNzJObL76ToeHY51JV2zKBuRqLaWFp6PjeTKa2r+zzPJ8WMXcf4GK5Qc2mk4ntDiTZu9oe6OtzNDjHGXeoVGikm3W2wmXiMKHsza22vtNpPk7FCHCNB8PTQKBYbCPA/BEUko9pxdXW0z6zwtd7mUMe+VGPQToiqPPkzzftzxFmcpfurynAVqhdrza7SYq7sb7mZuBw9xnb5R9Y8j3RGNasJQw4AzNoIOtWGyj1jV6xc+HKI2WQWCyne8Sjxk1S+8nRplmyqNT+7mHQJNukTwylnC9Tb05/SdObKoA0AFgOko4PComvzN1/QS38zActzODPkUnS6R7fh+O8UW5dskGsP3zlLiR1Pt9IZqtz6yo4zufOYR9nXIigyqNLnQAcyx2HvNXi/DvgIi3uxW7nq5YlreGoHpB8EpfFxKD8FPvHxcfp9p0PbHD/wAlW5hsvow/xM5S/uUSL2cirXjEyFI/lGZt5Zd6JloPOZEPc+kZjv7SkhWBrvBAkwlQSVFNZZnWx1QAXMo4nEFjYQ2Or37ogcPR5mVFfLMpO3SJ4bD33h8XXyDKvzH6RPVyjTe2n6yGGw92zH18Ym/lg9aRe7O8HzuCw03Mt9rsQ1FQg0ztf+1bfnebHAABz1+s57t6c2IVeQRfqSZywk551fSLkuONpGJUBYKbks9tPG9gDbfWdhS7Ova4YFhpqPrOKw1QgWBsynMnne+njfW09I4X2iStRd8uV1srg8ieY8Dr7TTynOKTj1/6icEk/wBsq0OzLOGNR7qNgugPn4QuAAorUKrdl7oHixsJ0iOLEb2FreU5IYvvkupUMyKRuNHBvf3nBynP8nZ1x3Z0mBTK6r5sfE21Mo8TxbIWAvz8veEw+IzYlhrZAo88+a/5D2g+KUiTPU8OuLX2cXlfkn9HO4Co73dtDe1uQtymmH0II9oKjhcpJHPfofHzhzv6TtSONsgoMUnkihQHqrkTK4238p/KabiZPHDak3lOiPZ50ujxHjSEvbxjcSfIq0xyGvnLFZc9cdAbzOx9TNUY+MU+2GPpEaKWhG1Mkj6bSI+aSUwpSTwBs5PQMT5WjDWWeB4U1cTTpg2zsAf+y13/AOIaKdcX+isTqaf2jSprfT92k6z5VduvdEs47Aii+Rb5RfLfU5czAAnna1r+EzeIvso5fnPJTUtr5PpOkCwr3B8NZHFVsiXHzNov3P1ksClwf3tqftA4NP4jEqv4Qben719ZWvnpESlS+2dn2I4bkTO27flNjtHTD4eoo3ADD+w3+xlrDoFUKugFhHKaEHY3v5HT7zhc25WKjyxNz5SObQyziqOR3X+klfYkflaVKnymdvZV6A0m3hakrUH3lipra3SU9MUXaGVSY1R8oI5mWFWwmfWe5vHHZM3xQBdWllmyiVRo1+UKwvrLkYRYLEVgBe9+d9PvA0uMsPwg+4kOIHu+omeomkIRa2YZMklKkzqeH9pFU95WXxGsDxzFCtUzjUFVtpbQDpOfUaGa9VLWHRQPpIeKEXyRpHJKUakVyoIsRLnCcaaLXPfRhldSfmQ9CdiNxKxSJUJlNJqmJado9I4NVD3dK+dNBlIyup6OOZlfjdO263Vr6jcTjOHYqrSbNSsL6EsLhh0t0+s063FK76Myr/2Lb6kmcMvDlzuL0dMfKiu1s06PEhRxKs5slRVDE8jbQnw13nRYrFJmKEgG11vpmHVTznP1cKn8Ojg57Lue8xYm5W/mdpHhfDquIABdCE2WoVLJ5Ive9SeU1wJqev0/sPI4uCk3/wBGwKZOvKDyAn5l9xIr2QUsc9Zyht3UGW5/FcknS82MBwzD4cWpUgp5ndj5sdZ6cYyfao8qeWEfxdlH+Fb+lvYxTXzjximnBGP9Q/R21SiZl8Tw+ZCvWKKETOXR5zjOzxpszXHO04d8PZ2v1jxS5dmceg1GjeNXoW1jRRJaGyKGdN2Ew/8A8xW6U6jDzC2+5iimGf8Axv8ATNcP+SP7RsdsQFZGA0yket7/AHM4ivVveKKeXg/BHvyboLjK2SkBzYfTdvztLfYvDFqgb1iijyf42S/zX6PTaO0jWbumKKecaLs4HtPTy1j/ALgrfTL/APWYuI0WKKejj/FDfTKVA6zRRIoppIjGRxb2FpnnWKKVDojL+QhbaQuRFFF8mbM3G1bkDpqfOV0EaKdK6ON7kw9IX9xNfEbn0/KPFM5dnRD8WQpJc2l7CYVqjinTXMx2FwL28WIEaKVDsjI2o6OjwvY6sf8AqOqeC94/YD6zawXZmim6Fz1drj/xFh9Iop2xhE82WWXs1moKyGn8NchFsoAA9LbTOxnZfMy1FOQjmNT6G97xRTOeKMntGkM+SC0zROGqKoBNyOZtc+0hlqdB9IopsujCXZH4NToPpFFFAR//2Q==";
export default Header;
