import { Button, Navbar, TextInput, NavbarToggle, NavbarCollapse, NavbarLink  } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon } from 'react-icons/fa'
export default function Header() {
    const path = useLocation.path;
  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-1'>Safe</span>
        Blog
        </Link>
        <form>
            <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            color='gray'
            >
            </TextInput>
        </form>
        <Button className='lg:hidden' color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className='hidden sm:inline' color='gray' pill>
                <FaMoon/>
            </Button>
            <Link to='/sign-in'>
            <Button color='gray' outline>
            Sign In
            </Button>
            </Link>
            <NavbarToggle/>
        </div>
        <NavbarCollapse>
                <NavbarLink active={path === "/" } as={'div'}>
                    <Link to="/">
                    Home
                    </Link>
                </NavbarLink>
                <NavbarLink active={path === "/about"} as={'div'}>
                    <Link to="/about">
                    About
                    </Link>
                </NavbarLink>
                <NavbarLink active={path === "/projects"} as={'div'}>
                    <Link to="/projects">
                    Projects
                    </Link>
                </NavbarLink>
            </NavbarCollapse>
    </Navbar>
  )
}
