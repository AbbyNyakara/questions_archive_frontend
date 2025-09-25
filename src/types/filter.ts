export type Country = {
  countryID: string
  countryName: string
}

export type Category = {
  categoryId: string
  categoryTitle: string
}

export type Round = {
  roundId: number
  roundLabel: string
  yearsOfSurvey: string
}

export type CountryResponse = Country[]

export type CategoryResponse = Country[]

export type RoundsApiResponse = Country[]