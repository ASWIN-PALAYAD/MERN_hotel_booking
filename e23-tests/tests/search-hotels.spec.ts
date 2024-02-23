import { test, expect } from '@playwright/test';
import { text } from 'stream/consumers';


const UI_URL = "http://localhost:5173"

test.beforeEach(async({page})=> {
    await page.goto(UI_URL);

    await page.getByRole('link',{name:"Sign In"}).click();
    await expect(page.getByRole('heading',{name:"Sign In"})).toBeVisible();

    await page.locator("[name=email]").fill("sherin@g.com");
    await page.locator("[name=password]").fill("1234567");
    await page.getByRole('button',{name:"Login"}).click();

    await expect(page.getByText('Sign in successfull')).toBeVisible();

})

test("Should show hotel search results",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going").fill("calicut");
    await page.getByRole('button',{name:"Search"}).click();

    await expect(page.getByText("Hotels found in calicut")).toBeVisible();
    await expect(page.getByText("Hotel calicut")).toBeVisible();
});

test("Should show hotel search details", async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going").fill("calicut");
    await page.getByRole('button',{name:"Search"}).click();

    await page.getByText("Hotel calicut").click();

    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button",{name:"Book Now"})).toBeVisible();

});

test('Should book hotel',async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going").fill("calicut");

    const date = new Date();
    date.setDate(date.getDate()+3);
    const formatedDate = date.toISOString().split('T')[0];
    await page.getByPlaceholder("Check-in Date").fill(formatedDate);

    await page.getByRole('button',{name:"Search"}).click();

    await page.getByText("Hotel calicut").click();

    await page.getByRole("button",{name:"Book Now"}).click()

    await expect(page.getByText("Total Cost : $ 300.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("4242 4242 4242 4242")
    await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
    await stripeFrame.locator('[placeholder="CVC"]').fill("242");
    await stripeFrame.locator('[placeholder="ZIP"]').fill("24224");

    await page.getByRole("button",{name:"Confirm Booking"}).click();
    // await expect(page.getByText("Booking Saved!")).toBeVisible();

    await page.getByRole("link",{name:"My Bookings"}).click();
    await expect(page.getByText("Hotel calicut")).toBeVisible();

});