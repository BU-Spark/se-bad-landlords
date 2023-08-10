SELECT
  property."OWNER",
  count(bpv.sam_id) AS violations_count
FROM
  (
    (
      (
        sam sam
        JOIN property property ON ((sam."PARCEL" = property."PID"))
      )
      JOIN parcel parcel ON ((sam."PARCEL" = parcel."MAP_PAR_ID"))
    )
    JOIN bpv bpv ON ((sam."SAM_ADDRESS_ID" = bpv.sam_id))
  )
WHERE
  ((property.year) :: integer = 2023)
GROUP BY
  property."OWNER"
ORDER BY
  (count(bpv.sam_id)) DESC
LIMIT
  10;