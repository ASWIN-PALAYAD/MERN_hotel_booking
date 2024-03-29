import { test, expect } from '@playwright/test';
import path from 'path';


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

test("should allow user to add a hotel",async({page})=> {
    await page.goto(`${UI_URL}/add-hotel`);

    await page.locator('[name=name]').fill("Test name");
    await page.locator('[name=city]').fill('test city');
    await page.locator('[name=country]').fill('test country');
    await page.locator('[name=description]').fill('test description');
    await page.locator('[name=pricePerNight]').fill('100');
    await page.selectOption('select[name=starRating]',"3");
    await page.getByText('Budget').click();
    await page.getByLabel('Free Wifi').check();
    await page.getByLabel("Parking").check();
    await page.locator('[name = adultCount]').fill('2');
    await page.locator('[name=childCount]').fill('1');

    await page.setInputFiles('[name=imageFiles]',[
        path.join(__dirname,"files","1.jpg"),
        path.join(__dirname,"files","2.jpg")
    ])

    await page.getByRole('button',{name:"Save"}).click();

    // await expect(page.getByText("Hotel Saved!")).toBeVisible();

});

test("should display hotels",async({page})=>{
    await page.goto(`${UI_URL}/my-hotels`);
    await expect(page.getByText("Test name").first()).toBeVisible();
    await expect(page.getByText("test description").first()).toBeVisible();
    await expect(page.getByText("test city,test country").first()).toBeVisible();
    await expect(page.getByText("Budget").first()).toBeVisible();
    await expect(page.getByText("100 per night").first()).toBeVisible();
    await expect(page.getByText("2 adults , 1 children").first()).toBeVisible();
    await expect(page.getByText("3 Star Rating").first()).toBeVisible();

    await expect(page.getByRole('link',{name:"View Details"}).first()).toBeVisible();
    await expect(page.getByRole('link',{name:"Add Hotel"})).toBeVisible();
});

test("should edit hotel",async({page})=>{
    await page.goto(`${UI_URL}/my-hotels`);
    
    await page.getByRole("link",{name:"View Details"}).first().click();

    await page.waitForSelector('[name=name]',{state:"attached"});
    await expect(page.locator('[name=name]')).toHaveValue('Hotel calicut');
    await page.locator('[name=name]').fill("Test name updated");

    await page.getByRole("button",{name:"Save"}).click();

    await expect(page.getByText("Hotel Saved!")).toBeVisible();

    await page.reload();

    await expect(page.locator('[name=name]')).toHaveValue("Test name updated");
    await page.locator('[name=name]').fill("Hotel calicut");
    await page.getByRole("button",{name:"Save"}).click();

})